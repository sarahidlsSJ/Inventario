import type { Product } from "@/types/product.types";

export type StockStatus =
  | "AVAILABLE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

export function getStockStatus(
  product: Product
): StockStatus {
  if (product.stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (product.stock <= product.minStock) {
    return "LOW_STOCK";
  }

  return "AVAILABLE";
}

export function getSuggestedPurchase(
  product: Product
): number {
  return Math.max(
    0,
    product.maxStock - product.stock
  );
}

export function isLowStock(
  product: Product
): boolean {
  return (
    product.stock > 0 &&
    product.stock <= product.minStock
  );
}

export function isOutOfStock(
  product: Product
): boolean {
  return product.stock <= 0;
}

export function needsRestock(
  product: Product
): boolean {
  return product.stock <= product.minStock;
}