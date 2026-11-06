"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  InventoryMovement,
  MovementType,
} from "@/types/movement.types";

const initialMovements: InventoryMovement[] = [
  {
    id: "mov-001",
    productId: "1",
    productName: 'Tornillo 1/4"',
    type: "IN",
    quantity: 200,
    previousStock: 150,
    newStock: 350,
    note: "Compra a proveedor",
    createdAt: new Date("2026-10-04T09:30:00"),
  },
  {
    id: "mov-002",
    productId: "2",
    productName: 'Clavo 2"',
    type: "OUT",
    quantity: 70,
    previousStock: 150,
    newStock: 80,
    note: "Venta de material",
    createdAt: new Date("2026-10-04T11:15:00"),
  },
  {
    id: "mov-003",
    productId: "4",
    productName: 'Broca 1/2"',
    type: "IN",
    quantity: 10,
    previousStock: 10,
    newStock: 20,
    note: "Reposición",
    createdAt: new Date("2026-10-05T08:20:00"),
  },
];

function formatDate(date: unknown) {
  if (!date) {
    return "-";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date as string);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getMovementLabel(type: MovementType) {
  return type === "IN" ? "Entrada" : "Salida";
}

export default function MovementsPage() {
  const [movements] =
    useState<InventoryMovement[]>(initialMovements);

  const [filter, setFilter] =
    useState<"ALL" | MovementType>("ALL");

  const [search, setSearch] = useState("");

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const matchesType =
        filter === "ALL" ||
        movement.type === filter;

      const matchesSearch =
        movement.productName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        movement.note
          ?.toLowerCase()
          .includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [movements, filter, search]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Movimientos
          </h1>

          <p className="text-sm text-muted-foreground">
            Consulta las entradas y salidas del inventario.
          </p>
        </div>

        {/* FILTROS */}
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="Buscar producto o nota..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="max-w-md"
          />

          <div className="flex gap-2">
            <Button
              variant={
                filter === "ALL"
                  ? "default"
                  : "outline"
              }
              onClick={() => setFilter("ALL")}
            >
              Todos
            </Button>

            <Button
              variant={
                filter === "IN"
                  ? "default"
                  : "outline"
              }
              onClick={() => setFilter("IN")}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Entradas
            </Button>

            <Button
              variant={
                filter === "OUT"
                  ? "default"
                  : "outline"
              }
              onClick={() => setFilter("OUT")}
            >
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Salidas
            </Button>
          </div>
        </div>

        {/* TABLA DESKTOP */}
        <div className="hidden overflow-hidden rounded-xl border bg-background md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Fecha
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Producto
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Movimiento
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Cantidad
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Stock
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Nota
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredMovements.map(
                  (movement) => (
                    <tr
                      key={movement.id}
                      className="hover:bg-muted/30"
                    >
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(
                          movement.createdAt
                        )}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {movement.productName}
                      </td>

                      <td className="px-4 py-4">
                        {movement.type === "IN" ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                            <ArrowDownToLine className="h-3.5 w-3.5" />
                            Entrada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
                            <ArrowUpFromLine className="h-3.5 w-3.5" />
                            Salida
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {movement.type === "IN"
                          ? "+"
                          : "-"}
                        {movement.quantity}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {movement.previousStock}
                        {" → "}
                        <strong>
                          {movement.newStock}
                        </strong>
                      </td>

                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {movement.note || "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TARJETAS MOBILE */}
        <div className="grid gap-3 md:hidden">
          {filteredMovements.map(
            (movement) => (
              <div
                key={movement.id}
                className="rounded-xl border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {movement.productName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(
                        movement.createdAt
                      )}
                    </p>
                  </div>

                  {movement.type === "IN" ? (
                    <ArrowDownToLine className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowUpFromLine className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Movimiento
                    </p>

                    <p className="font-medium">
                      {getMovementLabel(
                        movement.type
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Cantidad
                    </p>

                    <p className="font-semibold">
                      {movement.type === "IN"
                        ? "+"
                        : "-"}
                      {movement.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Stock anterior
                    </p>

                    <p>
                      {movement.previousStock}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Nuevo stock
                    </p>

                    <p className="font-semibold">
                      {movement.newStock}
                    </p>
                  </div>
                </div>

                {movement.note && (
                  <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">
                    {movement.note}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* SIN RESULTADOS */}
        {filteredMovements.length === 0 && (
          <div className="rounded-xl border bg-background py-12 text-center">
            <History className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No hay movimientos
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No encontramos movimientos con los filtros actuales.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}