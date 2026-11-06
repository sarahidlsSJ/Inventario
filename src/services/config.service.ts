import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  RotationType,
} from "@/types/product.types";

import type {
  RotationConfig,
} from "@/lib/inventory-config";

const CONFIG_COLLECTION = "settings";
const CONFIG_DOCUMENT = "inventory";

export interface InventoryConfig {
  rotationConfig: Record<
    RotationType,
    RotationConfig
  >;
}

export async function getInventoryConfig(): Promise<
  InventoryConfig | null
> {
  const configRef = doc(
    db,
    CONFIG_COLLECTION,
    CONFIG_DOCUMENT
  );

  const snapshot = await getDoc(configRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as InventoryConfig;
}

export async function saveInventoryConfig(
  config: InventoryConfig
): Promise<void> {
  const configRef = doc(
    db,
    CONFIG_COLLECTION,
    CONFIG_DOCUMENT
  );

  await setDoc(configRef, config);
}