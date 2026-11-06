"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Product,
  RotationType,
} from "@/types/product.types";

import type {
  RotationConfig,
} from "@/lib/inventory-config";

import type {
  InventoryMovement,
} from "@/types/movement.types";

import {
  getProducts,
  createProduct,
  updateProductFirestore,
  deleteProductFirestore,
} from "@/services/product.service";

import {
  getMovements,
  createMovement,
} from "@/services/movement.service";

import {
  getInventoryConfig,
  saveInventoryConfig,
} from "@/services/config.service";

interface InventoryContextType {
  products: Product[];
  movements: InventoryMovement[];

  rotationConfig: Record<
    RotationType,
    RotationConfig
  >;

  loading: boolean;

  addProduct: (
    product: Product
  ) => Promise<void>;

  updateProduct: (
    product: Product
  ) => Promise<void>;

  deleteProduct: (
    productId: string
  ) => Promise<void>;

  registerMovement: (
    movement: InventoryMovement,
    updatedProduct: Product
  ) => Promise<void>;

  getProductById: (
    productId: string
  ) => Product | undefined;

  updateRotationConfig: (
    rotation: RotationType,
    config: RotationConfig
  ) => Promise<void>;
}

const initialRotationConfig: Record<
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

const InventoryContext =
  createContext<
    InventoryContextType | undefined
  >(undefined);

export function InventoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [movements, setMovements] =
    useState<InventoryMovement[]>([]);

  const [rotationConfig, setRotationConfig] =
    useState<
      Record<
        RotationType,
        RotationConfig
      >
    >(initialRotationConfig);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true);

        const [
          firestoreProducts,
          firestoreMovements,
          firestoreConfig,
        ] = await Promise.all([
          getProducts(),
          getMovements(),
          getInventoryConfig(),
        ]);

        setProducts(firestoreProducts);

        setMovements(firestoreMovements);

        if (firestoreConfig) {
          setRotationConfig(
            firestoreConfig.rotationConfig
          );
        }
      } catch (error) {
        console.error(
          "Error al cargar inventario:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  const addProduct = async (
    product: Product
  ) => {
    try {
      await createProduct(product);

      setProducts((current) => [
        ...current,
        product,
      ]);
    } catch (error) {
      console.error(
        "Error al crear producto:",
        error
      );

      throw error;
    }
  };

  const updateProduct = async (
    product: Product
  ) => {
    try {
      await updateProductFirestore(
        product
      );

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? product
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error al actualizar producto:",
        error
      );

      throw error;
    }
  };

  const deleteProduct = async (
    productId: string
  ) => {
    try {
      await deleteProductFirestore(
        productId
      );

      setProducts((current) =>
        current.filter(
          (product) =>
            product.id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Error al eliminar producto:",
        error
      );

      throw error;
    }
  };

  const registerMovement = async (
    movement: InventoryMovement,
    updatedProduct: Product
  ) => {
    try {
      await updateProductFirestore(
        updatedProduct
      );

      await createMovement(
        movement
      );

      setProducts((current) =>
        current.map((product) =>
          product.id ===
          updatedProduct.id
            ? updatedProduct
            : product
        )
      );

      setMovements((current) => [
        movement,
        ...current,
      ]);
    } catch (error) {
      console.error(
        "Error al registrar movimiento:",
        error
      );

      throw error;
    }
  };

  const getProductById = (
    productId: string
  ) => {
    return products.find(
      (product) =>
        product.id === productId
    );
  };

  const updateRotationConfig =
    async (
      rotation: RotationType,
      config: RotationConfig
    ) => {
      const newConfig = {
        ...rotationConfig,
        [rotation]: {
          ...config,
        },
      };

      try {
        await saveInventoryConfig({
          rotationConfig: newConfig,
        });

        setRotationConfig(
          newConfig
        );
      } catch (error) {
        console.error(
          "Error al guardar configuración:",
          error
        );

        throw error;
      }
    };

  return (
    <InventoryContext.Provider
      value={{
        products,
        movements,
        rotationConfig,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        registerMovement,
        getProductById,
        updateRotationConfig,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context =
    useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventory debe utilizarse dentro de InventoryProvider"
    );
  }

  return context;
}