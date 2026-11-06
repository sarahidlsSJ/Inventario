import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  InventoryMovement,
} from "@/types/movement.types";

const MOVEMENTS_COLLECTION = "movements";

export async function getMovements(): Promise<
  InventoryMovement[]
> {
  const movementsQuery = query(
    collection(db, MOVEMENTS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    movementsQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as InventoryMovement[];
}

export async function createMovement(
  movement: InventoryMovement
): Promise<string> {
  const {
    id,
    ...movementData
  } = movement;

  const docRef = await addDoc(
    collection(db, MOVEMENTS_COLLECTION),
    movementData
  );

  return docRef.id;
}

export async function deleteMovement(
  movementId: string
): Promise<void> {
  await deleteDoc(
    doc(
      db,
      MOVEMENTS_COLLECTION,
      movementId
    )
  );
}