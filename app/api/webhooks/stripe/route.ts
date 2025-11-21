import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("⚠️ Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabaseAdmin = createAdminClient();

    console.log("🔔 Webhook received for session:", session.id);
    console.log("📦 Metadata:", session.metadata);

    // Caso 1: Compra de Carrito
    if (session.metadata?.type === "cart_checkout") {
        const buyerId = session.metadata.buyerId;
        const productIdsString = session.metadata.productIds;

        if (!buyerId || !productIdsString) {
            console.error("❌ Missing Cart Metadata (buyerId or productIds)");
            return new NextResponse("Missing Cart Metadata", { status: 400 });
        }

        const productIds = productIdsString.split(",");
        
        // Obtenemos precios y vendedores de la DB para ser seguros
        const { data: products, error } = await supabaseAdmin
            .from("products")
            .select("id, price, seller_id")
            .in("id", productIds);

        if (error || !products) {
             console.error("❌ Error fetching products from DB:", error);
             return new NextResponse("Error fetching products", { status: 500 });
        }

        for (const product of products) {
            // Insertar Orden
            const { error: orderError } = await supabaseAdmin.from("orders").insert({
                product_id: product.id,
                buyer_id: buyerId,
                seller_id: product.seller_id,
                purchase_price: product.price,
                stripe_payment_id: session.id,
                status: "completed",
            });

            if (orderError) console.error(`❌ Order Insert Error (${product.id}):`, orderError);

            // Marcar Vendido
            const { error: updateError } = await supabaseAdmin
                .from("products")
                .update({ is_sold: true })
                .eq("id", product.id);
            
            if (updateError) console.error(`❌ Product Update Error (${product.id}):`, updateError);
        }
        
        console.log(`✅ Cart processed: ${products.length} items sold.`);

    } 
    // Caso 2: Compra Individual
    else {
        const productId = session.metadata?.productId;
        const buyerId = session.metadata?.buyerId;
        const sellerId = session.metadata?.sellerId;

        if (!productId || !buyerId || !sellerId) {
             console.error("❌ Missing Metadata for Single Purchase");
             return new NextResponse("Missing Metadata", { status: 400 });
        }

        const purchasePrice = session.amount_total ? session.amount_total / 100 : 0;

        const { error: orderError } = await supabaseAdmin.from("orders").insert({
            product_id: productId,
            buyer_id: buyerId,
            seller_id: sellerId,
            purchase_price: purchasePrice,
            stripe_payment_id: session.id,
            status: "completed",
        });

        if (orderError) console.error("❌ DB Order Error:", orderError);

        const { error: updateError } = await supabaseAdmin
            .from("products")
            .update({ is_sold: true })
            .eq("id", productId);

        if (updateError) console.error("❌ Product Update Error:", updateError);
            
        console.log(`✅ Single item sold: ${productId}`);
    }
  }

  return new NextResponse(null, { status: 200 });
}