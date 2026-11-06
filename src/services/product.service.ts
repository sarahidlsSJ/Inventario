import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { Product } from "@/types/product.types";

const PRODUCTS_COLLECTION = "products";

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(
    collection(db, PRODUCTS_COLLECTION)
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Product[];
}

export async function createProduct(
  product: Product
): Promise<void> {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    product.id
  );

  await setDoc(productRef, product);
}

export async function updateProductFirestore(
  product: Product
): Promise<void> {
  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    product.id
  );

  await setDoc(productRef, product, {
    merge: true,
  });
}

export async function deleteProductFirestore(
  productId: string
): Promise<void> {
  if (!productId || typeof productId !== "string") {
    throw new Error(
      "deleteProductFirestore recibió un ID inválido."
    );
  }

  await deleteDoc(
    doc(
      db,
      PRODUCTS_COLLECTION,
      productId
    )
  );
}