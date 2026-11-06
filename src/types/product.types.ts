export type ProductType = "CONSUMABLE" | "TOOL";

export type RotationType = "HIGH" | "MEDIUM" | "LOW";

export type ProductStatus =
  | "AVAILABLE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

export interface Product {
  id: string;

  name: string;
  code: string;
  description?: string;

  type: ProductType;
  rotation: RotationType;

  stock: number;
  minStock: number;
  maxStock: number;

  purchasePrice: number;
  salePrice: number;

  active: boolean;

  createdAt?: unknown;
  updatedAt?: unknown;
}