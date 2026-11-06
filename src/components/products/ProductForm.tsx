"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Product,
  ProductType,
  RotationType,
} from "@/types/product.types";

import { useInventory } from "@/context/InventoryContext";

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(
    product?.name ?? ""
  );
  const { rotationConfig } =
    useInventory();

  const [code, setCode] = useState(
    product?.code ?? ""
  );

  const [description, setDescription] = useState(
    product?.description ?? ""
  );

  const [type, setType] = useState<ProductType>(
    product?.type ?? "CONSUMABLE"
  );

  const [rotation, setRotation] =
    useState<RotationType>(
      product?.rotation ?? "MEDIUM"
    );

  const [stock, setStock] = useState(
    product?.stock?.toString() ?? "0"
  );

  const [minStock, setMinStock] = useState(
    product?.minStock?.toString() ?? "20"
  );

  const [maxStock, setMaxStock] = useState(
    product?.maxStock?.toString() ?? "60"
  );

  const [purchasePrice, setPurchasePrice] =
    useState(
      product?.purchasePrice?.toString() ?? "0"
    );

  const [salePrice, setSalePrice] =
    useState(
      product?.salePrice?.toString() ?? "0"
    );

  const handleRotationChange = (
    value: RotationType
  ) => {
    setRotation(value);

    // Cuando estamos creando un producto,
    // la rotación define los valores iniciales.
    if (!product) {
      setMinStock(
        rotationConfig[value].minStock.toString()
      );

      setMaxStock(
        rotationConfig[value].maxStock.toString()
      );
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const parsedStock = Number(stock);
    const parsedMinStock = Number(minStock);
    const parsedMaxStock = Number(maxStock);
    const parsedPurchasePrice =
      Number(purchasePrice);
    const parsedSalePrice = Number(salePrice);

    if (!name.trim()) {
      alert("El nombre del producto es obligatorio.");
      return;
    }

    if (!code.trim()) {
      alert("El código del producto es obligatorio.");
      return;
    }

    if (parsedStock < 0) {
      alert("El stock no puede ser negativo.");
      return;
    }

    if (parsedMinStock < 0) {
      alert("El stock mínimo no puede ser negativo.");
      return;
    }

    if (parsedMaxStock < 0) {
      alert("El stock máximo no puede ser negativo.");
      return;
    }

    if (parsedMinStock > parsedMaxStock) {
      alert(
        "El stock mínimo no puede ser mayor que el máximo."
      );
      return;
    }

    if (parsedPurchasePrice < 0) {
      alert(
        "El precio de compra no puede ser negativo."
      );
      return;
    }

    if (parsedSalePrice < 0) {
      alert(
        "El precio de venta no puede ser negativo."
      );
      return;
    }

    const newProduct: Product = {
      id: product?.id ?? crypto.randomUUID(),

      name: name.trim(),
      code: code.trim(),
      description:
        description.trim() || undefined,

      type,
      rotation,

      stock: parsedStock,
      minStock: parsedMinStock,
      maxStock: parsedMaxStock,

      purchasePrice: parsedPurchasePrice,
      salePrice: parsedSalePrice,

      active: product?.active ?? true,

      createdAt:
        product?.createdAt ?? new Date(),

      updatedAt: new Date(),
    };

    onSave(newProduct);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-[calc(100vh-6rem)] flex-col"
    >
      {/* HEADER */}
      <div className="shrink-0 border-b px-6 py-5">
        <h2 className="text-lg font-semibold">
          {product
            ? "Editar producto"
            : "Nuevo producto"}
        </h2>

        <p className="text-sm text-muted-foreground">
          Completa la información del producto.
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {/* NOMBRE */}
        <div className="space-y-2">
          <Label htmlFor="product-name">
            Nombre
          </Label>

          <Input
            id="product-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Ej. Tornillo 1/4"
          />
        </div>

        {/* CÓDIGO */}
        <div className="space-y-2">
          <Label htmlFor="product-code">
            Código
          </Label>

          <Input
            id="product-code"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            placeholder="Ej. TOR-001"
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div className="space-y-2">
          <Label htmlFor="product-description">
            Descripción
          </Label>

          <Input
            id="product-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Descripción del producto"
          />
        </div>

        {/* TIPO */}
        <div className="space-y-2">
          <Label>Tipo</Label>

          <Select
            value={type}
            onValueChange={(value) =>
              setType(value as ProductType)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="CONSUMABLE">
                Consumible
              </SelectItem>

              <SelectItem value="TOOL">
                Herramienta
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROTACIÓN */}
        <div className="space-y-2">
          <Label>Rotación</Label>

          <Select
            value={rotation}
            onValueChange={(value) =>
              handleRotationChange(
                value as RotationType
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rotación" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="HIGH">
                Alta
              </SelectItem>

              <SelectItem value="MEDIUM">
                Media
              </SelectItem>

              <SelectItem value="LOW">
                Baja
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PRECIOS */}
        <div className="rounded-xl border p-4">
          <div className="mb-4">
            <h3 className="font-medium">
              Precios
            </h3>

            <p className="text-sm text-muted-foreground">
              Define cuánto cuesta y cuánto se vende el producto.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* PRECIO COMPRA */}
            <div className="space-y-2">
              <Label htmlFor="purchase-price">
                Precio de compra
              </Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>

                <Input
                  id="purchase-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(event) =>
                    setPurchasePrice(
                      event.target.value
                    )
                  }
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* PRECIO VENTA */}
            <div className="space-y-2">
              <Label htmlFor="sale-price">
                Precio de venta
              </Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>

                <Input
                  id="sale-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salePrice}
                  onChange={(event) =>
                    setSalePrice(
                      event.target.value
                    )
                  }
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* GANANCIA */}
          {Number(salePrice) >= 0 &&
            Number(purchasePrice) >= 0 && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Ganancia por unidad
                  </span>

                  <span
                    className={`font-semibold ${
                      Number(salePrice) -
                        Number(purchasePrice) <
                      0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    $
                    {(
                      Number(salePrice) -
                      Number(purchasePrice)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* STOCK */}
        <div className="space-y-2">
          <Label htmlFor="product-stock">
            Stock actual
          </Label>

          <Input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) =>
              setStock(event.target.value)
            }
          />
        </div>

        {/* MIN / MAX */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="min-stock">
              Stock mínimo
            </Label>

            <Input
              id="min-stock"
              type="number"
              min="0"
              step="1"
              value={minStock}
              onChange={(event) =>
                setMinStock(event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-stock">
              Stock máximo
            </Label>

            <Input
              id="max-stock"
              type="number"
              min="0"
              step="1"
              value={maxStock}
              onChange={(event) =>
                setMaxStock(event.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex shrink-0 justify-end gap-2 border-t px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button type="submit">
          {product
            ? "Guardar cambios"
            : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}