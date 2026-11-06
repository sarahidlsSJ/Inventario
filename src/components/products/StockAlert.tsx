"use client";

import {
  AlertTriangle,
  PackageX,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type { Product } from "@/types/product.types";

import {
  getStockStatus,
  getSuggestedPurchase,
} from "@/lib/stock.utils";

interface StockAlertProps {
  product: Product;
}

export default function StockAlert({
  product,
}: StockAlertProps) {
  const status =
    getStockStatus(product);

  if (status === "AVAILABLE") {
    return null;
  }

  const suggested =
    getSuggestedPurchase(product);

  if (status === "OUT_OF_STOCK") {
    return (
      <Card className="border-red-500/30 bg-red-500/10 p-4">
        <div className="flex items-start gap-3">
          <PackageX className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

          <div className="min-w-0">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Producto agotado
            </p>

            <p className="text-sm text-muted-foreground">
              {product.name} no tiene existencias.
            </p>

            <p className="mt-1 text-sm font-medium">
              Sugerencia de compra:{" "}
              {suggested} unidades
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-orange-500/30 bg-orange-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

        <div className="min-w-0">
          <p className="font-semibold text-orange-600 dark:text-orange-400">
            Stock bajo
          </p>

          <p className="text-sm text-muted-foreground">
            {product.name} está por debajo del
            nivel recomendado.
          </p>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>
              Actual:{" "}
              <strong>{product.stock}</strong>
            </span>

            <span>
              Mínimo:{" "}
              <strong>{product.minStock}</strong>
            </span>

            <span>
              Comprar:{" "}
              <strong>{suggested}</strong>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}