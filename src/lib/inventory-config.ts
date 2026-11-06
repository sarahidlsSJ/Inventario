import type { RotationType } from "@/types/product.types";

export interface RotationConfig {
  minStock: number;
  maxStock: number;
}

export const rotationConfig: Record<
  RotationType,
  RotationConfig
> = {
  HIGH: {
    minStock: 100,
    maxStock: 500,
  },

  MEDIUM: {
    minStock: 20,
    maxStock: 60,
  },

  LOW: {
    minStock: 2,
    maxStock: 5,
  },
};