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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag, Tag } from "lucide-react"; // Nuevo icono Tag

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/auth");
  }

  const userId = userData.user.id;

  // Ventas (Histórico)
  const { data: sales } = await supabase
    .from("orders")
    .select("*, products(*), profiles!orders_buyer_id_fkey(username)")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  // Compras (Histórico)
  const { data: purchases } = await supabase
    .from("orders")
    .select("*, products(*), profiles!orders_seller_id_fkey(username)")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  // NUEVO: Publicaciones Activas (Selling)
  const { data: selling } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", userId)
    .eq("is_sold", false)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
            <Link href="/sell">Create New Listing</Link>
        </Button>
      </div>

      <Tabs defaultValue="selling" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="selling">Active Listings</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
        </TabsList>

        {/* Pestaña de Publicaciones Activas */}
        <TabsContent value="selling">
            <Card>
                <CardHeader>
                    <CardTitle>Active Listings</CardTitle>
                    <CardDescription>Products you are currently selling.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!selling || selling.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                                <Tag className="h-8 w-8 opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold">No active listings</h3>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/sell">Start selling today</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selling.map((product: any) => (
                                <div key={product.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 overflow-hidden rounded bg-muted border">
                                            <img src={product.image_url || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/products/${product.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/products/${product.id}`}>View</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Pestañas existentes de Sales y Purchases... (El código que ya tenías va aquí dentro de sus TabsContent) */}
        <TabsContent value="sales">
            {/* ... Contenido de Sales anterior ... */}
             <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>
                Overview of items you have sold on Blaze.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!sales || sales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                    <Package className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold">No sales yet</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.map((order: any) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30">
                        {/* ... Renderizado de orden de venta ... */}
                         <div className="flex items-center gap-4 w-full">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                          <img
                            src={order.products?.image_url || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold truncate">
                              {order.products?.name}
                            </h4>
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Sold
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Buyer: <span className="font-medium text-foreground">@{order.profiles?.username ?? "Unknown"}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end sm:gap-1">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{formatPrice(order.purchase_price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
            {/* ... Contenido de Purchases anterior ... */}
             <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                Items you have purchased on the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!purchases || purchases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                    <ShoppingBag className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold">No purchases yet</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((order: any) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30">
                        {/* ... Renderizado de orden de compra ... */}
                         <div className="flex items-center gap-4 w-full">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                          <img
                            src={order.products?.image_url || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">
                            {order.products?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Seller: <span className="font-medium text-foreground">@{order.profiles?.username ?? "Unknown"}</span>
                          </p>
                           <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end sm:gap-1">
                        <span className="text-lg font-bold">
                          -{formatPrice(order.purchase_price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}