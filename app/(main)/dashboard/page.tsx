import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        redirect("/auth");
    }

    const userId = userData.user.id;

    const { data: sales } = await supabase
        .from("orders")
        .select("*, products(*), profiles!orders_buyer_id_fkey(username)")
        .eq("seller_id", userId)
        .order("created_at", { ascending: false });

    const { data: purchases } = await supabase
        .from("orders")
        .select("*, products(*), profiles!orders_seller_id_fkey(username)")
        .eq("buyer_id", userId)
        .order("created_at", { ascending: false });

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-8 md:grid-cols-2">

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>My Sales</CardTitle>
                            <CardDescription>Items you have sold on Blaze.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!sales || sales.length === 0 ? (
                                <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                                    <Package className="mb-2 h-8 w-8 opacity-50" />
                                    <p>No sales yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sales.map((order: any) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 overflow-hidden rounded bg-muted">
                                                    <img
                                                        src={order.products?.image_url || "/placeholder.svg"}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{order.products?.name}
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300 mr-2">
                                                            Paid
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1 mb-1">
                                                        Bought by @{order.profiles?.username ?? 'N/A'}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        Sold on {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">
                                                    +{formatPrice(order.purchase_price)}
                                                </p>
                                                <Link
                                                    href={`/products/${order.product_id}`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    View Item
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>My Purchases</CardTitle>
                            <CardDescription>Items you have bought.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!purchases || purchases.length === 0 ? (
                                <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                                    <ShoppingBag className="mb-2 h-8 w-8 opacity-50" />
                                    <p>No purchases yet.</p>
                                    <Button variant="link" asChild className="mt-2">
                                        <Link href="/">Browse Products</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {purchases.map((order: any) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 overflow-hidden rounded bg-muted">
                                                    <img
                                                        src={order.products?.image_url || "/placeholder.svg"}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{order.products?.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Purchased on {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">
                                                    {formatPrice(order.purchase_price)}
                                                </p>
                                                <Link
                                                    href={`/products/${order.product_id}`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    View Item
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}