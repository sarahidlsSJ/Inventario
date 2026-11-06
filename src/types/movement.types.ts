export type MovementType = "IN" | "OUT";

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  note?: string;
  createdAt?: unknown;
}