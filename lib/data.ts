import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type ProductFilters = {
    page?: number;
    category?: string;
    sort?: string;
    search?: string;
};

const ITEMS_PER_PAGE = 12;

export const getFilteredProducts = cache(async (filters: ProductFilters) => {
    const supabase = await createClient();
    const page = filters.page || 1;
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
        .from("products")
        .select(`*, profiles ( username )`, { count: "exact" })
        .eq("is_sold", false);

    if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
    }

    if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters.sort === "price_asc") {
        query = query.order("price", { ascending: true });
    } else if (filters.sort === "price_desc") {
        query = query.order("price", { ascending: false });
    } else {
        query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
        console.error("Error fetching products:", error);
        return { products: [], totalPages: 0 };
    }

    const products = data.map((product: any) => {
        const seller = Array.isArray(product.profiles)
            ? product.profiles[0]
            : product.profiles;
        return {
            ...product,
            sellerName: seller?.username ?? "Unknown Seller",
        };
    });

    return {
        products,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
    };
});

export const getProductById = cache(async (id: string) => {
    const supabase = await createClient();
    const { data: product, error } = await supabase
        .from("products")
        .select(`*, profiles ( username, avatar_url )`)
        .eq("id", id)
        .single();

    if (error || !product) return null;

    const seller = Array.isArray(product.profiles)
        ? product.profiles[0]
        : product.profiles;

    return {
        ...product,
        sellerName: seller?.username ?? "Unknown Seller",
        sellerAvatar: seller?.avatar_url ?? null,
    };
});

export const hasUserBoughtProduct = cache(async (userId: string, productId: string) => {
    const supabase = await createClient();

    const { data: order, error } = await supabase
        .from('orders')
        .select('id')
        .eq('buyer_id', userId)
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error checking purchase status:", error);
    }

    return !!order;
});

export const productHasOrders = cache(async (productId: string) => {
    const supabase = await createClient();
    const { count } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('product_id', productId);

    return (count ?? 0) > 0;
});