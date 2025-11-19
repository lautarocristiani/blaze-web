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
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Solo nos importa este evento para la creación de órdenes
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log("🔔 Webhook received: checkout.session.completed");
    console.log("📦 Session Metadata:", session.metadata);

    const supabaseAdmin = createAdminClient();

    // Validar que exista la metadata
    if (!session.metadata?.productId || !session.metadata?.buyerId || !session.metadata?.sellerId) {
      console.error("❌ Error: Missing metadata in Stripe Session", session.metadata);
      return new NextResponse("Missing Metadata", { status: 400 });
    }

    const { productId, buyerId, sellerId } = session.metadata;

    // 1. Crear la Orden
    console.log(`📝 Creating order for product ${productId}...`);
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      product_id: productId,
      buyer_id: buyerId,
      seller_id: sellerId,
      purchase_price: session.amount_total ? session.amount_total / 100 : 0,
      stripe_payment_id: session.id,
      status: "completed",
    });

    if (orderError) {
      console.error("❌ Error creating order in DB:", orderError);
      return new NextResponse("Database Error creating Order", { status: 500 });
    }
    console.log("✅ Order created successfully.");

    // 2. Marcar producto como VENDIDO
    console.log(`🏷️ Marking product ${productId} as sold...`);
    const { error: productError } = await supabaseAdmin
      .from("products")
      .update({ is_sold: true })
      .eq("id", productId);

    if (productError) {
      console.error("❌ Error updating product status:", productError);
      // No retornamos error 500 porque la orden ya se creó y cobró.
      // En un sistema real, aquí enviarías una alerta a un sistema de monitoreo (Sentry).
    } else {
      console.log("✅ Product marked as sold.");
    }
  }

  return new NextResponse(null, { status: 200 });
}