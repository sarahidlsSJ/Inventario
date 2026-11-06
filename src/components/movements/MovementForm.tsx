"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

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

import type { Product } from "@/types/product.types";
import type {
  InventoryMovement,
  MovementType,
} from "@/types/movement.types";

interface MovementFormProps {
  products: Product[];
  product?: Product | null;
  onSave: (
    movement: InventoryMovement,
    updatedProduct: Product
  ) => void;
  onCancel: () => void;
}

export default function MovementForm({
  products,
  product,
  onSave,
  onCancel,
}: MovementFormProps) {
  const [selectedProductId, setSelectedProductId] = useState(
    product?.id ?? ""
  );

  const [type, setType] = useState<MovementType>("IN");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const selectedProduct =
    products.find((item) => item.id === selectedProductId) ?? null;

  const currentStock = selectedProduct?.stock ?? 0;

  const quantityNumber = Number(quantity) || 0;

  const newStock =
    type === "IN"
      ? currentStock + quantityNumber
      : currentStock - quantityNumber;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProduct) {
      alert("Selecciona un producto.");
      return;
    }

    if (!quantityNumber || quantityNumber <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    if (type === "OUT" && quantityNumber > currentStock) {
      alert("No puedes retirar más productos de los disponibles.");
      return;
    }

    const movement: InventoryMovement = {
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type,
      quantity: quantityNumber,
      previousStock: currentStock,
      newStock,
      note: note.trim() || undefined,
      createdAt: new Date(),
    };

    const updatedProduct: Product = {
      ...selectedProduct,
      stock: newStock,
      updatedAt: new Date(),
    };

    onSave(movement, updatedProduct);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-[calc(100vh-6rem)] flex-col"
    >
      {/* HEADER */}
      <div className="shrink-0 border-b px-6 py-5">
        <h2 className="text-lg font-semibold">
          Registrar movimiento
        </h2>

        <p className="text-sm text-muted-foreground">
          Registra una entrada o salida de inventario.
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {/* PRODUCTO */}
        <div className="space-y-2">
          <Label>Producto</Label>

          <Select
            value={selectedProductId}
            onValueChange={(value) => setSelectedProductId(value ?? "")}
            disabled={!!product}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>

            <SelectContent>
              {products.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} — {item.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TIPO */}
        <div className="space-y-2">
          <Label>Tipo de movimiento</Label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("IN")}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                type === "IN"
                  ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950"
                  : "hover:bg-muted"
              }`}
            >
              <ArrowDownToLine className="h-4 w-4" />
              Entrada
            </button>

            <button
              type="button"
              onClick={() => setType("OUT")}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                type === "OUT"
                  ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950"
                  : "hover:bg-muted"
              }`}
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Salida
            </button>
          </div>
        </div>

        {/* STOCK ACTUAL */}
        {selectedProduct && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Stock actual
              </span>

              <span className="font-semibold">
                {currentStock}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Stock después del movimiento
              </span>

              <span
                className={`font-semibold ${
                  newStock <= selectedProduct.minStock
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {newStock}
              </span>
            </div>
          </div>
        )}

        {/* CANTIDAD */}
        <div className="space-y-2">
          <Label htmlFor="quantity">
            Cantidad
          </Label>

          <Input
            id="quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Ej. 50"
          />
        </div>

        {/* NOTA */}
        <div className="space-y-2">
          <Label htmlFor="note">
            Nota
          </Label>

          <Input
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={
              type === "IN"
                ? "Ej. Compra a proveedor"
                : "Ej. Venta o salida de material"
            }
          />
        </div>

        {/* PREVISUALIZACIÓN */}
        {selectedProduct && quantityNumber > 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">
              Resumen
            </p>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Producto
                </span>

                <span>{selectedProduct.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Movimiento
                </span>

                <span>
                  {type === "IN" ? "Entrada" : "Salida"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Cantidad
                </span>

                <span>
                  {quantityNumber}
                </span>
              </div>

              <div className="flex justify-between font-medium">
                <span>
                  Nuevo stock
                </span>

                <span>
                  {newStock}
                </span>
              </div>
            </div>
          </div>
        )}
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
          Registrar movimiento
        </Button>
      </div>
    </form>
  );
}