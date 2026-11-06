"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import ProductForm from "@/components/products/ProductForm";
import MovementForm from "@/components/movements/MovementForm";

import type {
  Product,
  ProductType,
  RotationType,
} from "@/types/product.types";

import type { InventoryMovement, MovementType } from "@/types/movement.types";
import AppLayout from "@/components/layout/AppLayout";
import { useInventory } from "@/context/InventoryContext";



// const initialProducts: Product[] = [
//   {
//     id: "1",
//     name: 'Tornillo 1/4"',
//     code: "TOR-001",
//     description: "Tornillo metálico de 1/4",
//     type: "CONSUMABLE",
//     rotation: "HIGH",
//     stock: 350,
//     minStock: 100,
//     maxStock: 500,
//     purchasePrice: 1.2,
//     salePrice: 2.0,
//     active: true,
//   },
//   {
//     id: "2",
//     name: 'Clavo 2"',
//     code: "CLA-001",
//     description: "Clavo para construcción",
//     type: "CONSUMABLE",
//     rotation: "HIGH",
//     stock: 80,
//     minStock: 150,
//     maxStock: 700,
//     purchasePrice: 0.8,
//     salePrice: 1.5,
//     active: true,
//   },
//   {
//     id: "3",
//     name: "Taladro Bosch",
//     code: "TAL-001",
//     description: "Taladro eléctrico",
//     type: "TOOL",
//     rotation: "LOW",
//     stock: 3,
//     minStock: 1,
//     maxStock: 5,
//     purchasePrice: 50.0,
//     salePrice: 75.0,  
//     active: true,
//   },
//   {
//     id: "4",
//     name: 'Broca 1/2"',
//     code: "BRO-001",
//     description: "Broca para metal",
//     type: "TOOL",
//     rotation: "MEDIUM",
//     stock: 20,
//     minStock: 10,
//     maxStock: 30,
//     purchasePrice: 10.0,
//     salePrice: 20.0,
//     active: true,
//   },
// ];

function getStockStatus(product: Product) {
  if (product.stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (product.stock <= product.minStock) {
    return "LOW_STOCK";
  }

  return "AVAILABLE";
}

function getTypeLabel(type: ProductType) {
  return type === "CONSUMABLE"
    ? "Consumible"
    : "Herramienta";
}

function getRotationLabel(rotation: RotationType) {
  switch (rotation) {
    case "HIGH":
      return "Alta";

    case "MEDIUM":
      return "Media";

    case "LOW":
      return "Baja";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "Disponible";

    case "LOW_STOCK":
      return "Stock bajo";

    case "OUT_OF_STOCK":
      return "Agotado";

    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";

    case "LOW_STOCK":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";

    case "OUT_OF_STOCK":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";

    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function ProductsPage() {
  const {
    products,
    movements,
    addProduct,
    updateProduct,
    deleteProduct,
    registerMovement,
  } = useInventory();
  

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [movementOpen, setMovementOpen] =
    useState(false);

  const [movementType, setMovementType] =
    useState<MovementType>("IN");

  const [movementProduct, setMovementProduct] =
    useState<Product | null>(null);

  

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.code}`
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  // ==========================================
  // PRODUCTOS
  // ==========================================

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }

    setFormOpen(false);
    setEditingProduct(null);
  };

   

  const handleDeleteProduct = (productId: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );

    if (!confirmed) return;

    deleteProduct(productId);
  };

  // ==========================================
  // MOVIMIENTOS
  // ==========================================

  const handleOpenMovement = (
    product: Product,
    type: MovementType
  ) => {
    setMovementProduct(product);
    setMovementType(type);
    setMovementOpen(true);
  };

  const handleSaveMovement = (
    movement: InventoryMovement,
    updatedProduct: Product
  ) => {
    registerMovement(
      movement,
      updatedProduct
    );

    setMovementOpen(false);
    setMovementProduct(null);
  };

  return (
  <AppLayout>
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Productos
          </h1>

          <p className="text-sm text-muted-foreground">
            Administra los productos y el stock del inventario.
          </p>
        </div>

        <Button onClick={handleNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {/* BUSCADOR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Buscar producto o código..."
          className="pl-9"
        />
      </div>

      {/* DESKTOP */}
      <div className="hidden overflow-hidden rounded-xl border bg-background md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Producto
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Tipo
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Rotación
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Stock
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium">
                  Estado
                </th>

                <th className="px-4 py-3 text-right text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredProducts.map((product) => {
                const status =
                  getStockStatus(product);

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/30"
                  >
                    {/* PRODUCTO */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">
                          {product.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {product.code}
                        </p>
                      </div>
                    </td>

                    {/* TIPO */}
                    <td className="px-4 py-4 text-sm">
                      {getTypeLabel(product.type)}
                    </td>

                    {/* ROTACIÓN */}
                    <td className="px-4 py-4 text-sm">
                      {getRotationLabel(
                        product.rotation
                      )}
                    </td>

                    {/* STOCK */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold">
                          {product.stock}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Min: {product.minStock} · Max:{" "}
                          {product.maxStock}
                        </p>
                      </div>
                    </td>

                    {/* ESTADO */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          status
                        )}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Registrar entrada"
                          onClick={() =>
                            handleOpenMovement(
                              product,
                              "IN"
                            )
                          }
                        >
                          <ArrowDownToLine className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Registrar salida"
                          onClick={() =>
                            handleOpenMovement(
                              product,
                              "OUT"
                            )
                          }
                        >
                          <ArrowUpFromLine className="h-4 w-4 text-red-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() =>
                            handleEditProduct(product)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Eliminar"
                          onClick={() =>
                              handleDeleteProduct(product.id)
                            }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE */}
      <div className="grid gap-4 md:hidden">
        {filteredProducts.map((product) => {
          const status =
            getStockStatus(product);

          return (
            <div
              key={product.id}
              className="rounded-xl border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {product.code}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    status
                  )}`}
                >
                  {getStatusLabel(status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Tipo
                  </p>

                  <p className="font-medium">
                    {getTypeLabel(product.type)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Rotación
                  </p>

                  <p className="font-medium">
                    {getRotationLabel(
                      product.rotation
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Stock
                  </p>

                  <p className="font-semibold">
                    {product.stock}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Min / Max
                  </p>

                  <p className="font-medium">
                    {product.minStock} /{" "}
                    {product.maxStock}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleOpenMovement(
                      product,
                      "IN"
                    )
                  }
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4 text-green-600" />
                  Entrada
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleOpenMovement(
                      product,
                      "OUT"
                    )
                  }
                >
                  <ArrowUpFromLine className="mr-2 h-4 w-4 text-red-600" />
                  Salida
                </Button>
              </div>

              <div className="mt-2 flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleEditProduct(product)
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleDeleteProduct(product.id)
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Eliminar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIN RESULTADOS */}
      {filteredProducts.length === 0 && (
        <div className="rounded-xl border bg-background py-12 text-center">
          <p className="font-medium">
            No se encontraron productos
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Intenta con otro nombre o código.
          </p>
        </div>
      )}

      {/* ========================================
          MODAL PRODUCTO
      ======================================== */}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl p-0">
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ========================================
          MODAL MOVIMIENTO
      ======================================== */}

      <Dialog
        open={movementOpen}
        onOpenChange={(open) => {
          setMovementOpen(open);

          if (!open) {
            setMovementProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-xl p-0">
          <MovementForm
            products={products}
            product={movementProduct}
            onSave={handleSaveMovement}
            onCancel={() => {
              setMovementOpen(false);
              setMovementProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}