"use client";

import {
  AlertTriangle,
  PackageX,
  ShoppingCart,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useInventory } from "@/context/InventoryContext";

import {
  getStockStatus,
  getSuggestedPurchase,
} from "@/lib/stock.utils";

export default function AlertsPage() {
  const { products } =
    useInventory();

  const activeProducts =
    products.filter(
      (product) => product.active
    );

  const lowStockProducts =
    activeProducts.filter((product) => {
      const status =
        getStockStatus(product);

      return (
        status === "LOW_STOCK" ||
        status === "OUT_OF_STOCK"
      );
    });

  const outOfStock =
    activeProducts.filter(
      (product) =>
        getStockStatus(product) ===
        "OUT_OF_STOCK"
    );

  const lowStock =
    activeProducts.filter(
      (product) =>
        getStockStatus(product) ===
        "LOW_STOCK"
    );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Alertas de stock
          </h1>

          <p className="text-sm text-muted-foreground">
            Productos que necesitan atención o
            reposición.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Stock bajo
                </p>

                <p className="text-2xl font-bold">
                  {lowStock.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <PackageX className="h-5 w-5 text-red-500" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Agotados
                </p>

                <p className="text-2xl font-bold">
                  {outOfStock.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Productos a revisar
                </p>

                <p className="text-2xl font-bold">
                  {lowStockProducts.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="font-medium">
                Todo está en orden 🎉
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                No hay productos con stock bajo.
              </p>
            </Card>
          ) : (
            lowStockProducts.map(
              (product) => {
                const status =
                  getStockStatus(product);

                const suggested =
                  getSuggestedPurchase(
                    product
                  );

                return (
                  <Card
                    key={product.id}
                    className="p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">
                            {product.name}
                          </h2>

                          {status ===
                          "OUT_OF_STOCK" ? (
                            <Badge variant="destructive">
                              Agotado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Stock bajo
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Código: {product.code}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Rotación:{" "}
                          {product.rotation}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center sm:min-w-[360px]">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Actual
                          </p>

                          <p className="font-bold">
                            {product.stock}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Máximo
                          </p>

                          <p className="font-bold">
                            {product.maxStock}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Comprar
                          </p>

                          <p className="font-bold text-primary">
                            {suggested}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
}