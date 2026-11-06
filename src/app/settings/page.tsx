"use client";

import { useState } from "react";
import {
  Save,
  RotateCcw,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useInventory } from "@/context/InventoryContext";

import type {
  RotationType,
} from "@/types/product.types";

const rotationInfo: Record<
  RotationType,
  {
    title: string;
    description: string;
  }
> = {
  HIGH: {
    title: "Alta rotación",
    description:
      "Productos que salen con mucha frecuencia.",
  },
  MEDIUM: {
    title: "Media rotación",
    description:
      "Productos con movimiento moderado.",
  },
  LOW: {
    title: "Baja rotación",
    description:
      "Productos que salen ocasionalmente.",
  },
};

const rotations: RotationType[] = [
  "HIGH",
  "MEDIUM",
  "LOW",
];

export default function SettingsPage() {
  const {
    rotationConfig,
    updateRotationConfig,
  } = useInventory();

  const [values, setValues] =
    useState(rotationConfig);

  const [saved, setSaved] =
    useState(false);

  const handleChange = (
    rotation: RotationType,
    field: "minStock" | "maxStock",
    value: string
  ) => {
    const numberValue =
      value === ""
        ? 0
        : Math.max(0, Number(value));

    setValues((current) => ({
      ...current,
      [rotation]: {
        ...current[rotation],
        [field]: numberValue,
      },
    }));

    setSaved(false);
  };

  const handleSave = () => {
    for (const rotation of rotations) {
      const config = values[rotation];

      if (config.minStock > config.maxStock) {
        alert(
          `El stock mínimo de "${rotationInfo[rotation].title}" no puede ser mayor que el máximo.`
        );

        return;
      }

      updateRotationConfig(
        rotation,
        config
      );
    }

    setSaved(true);
  };

  const handleReset = () => {
    setValues(rotationConfig);
    setSaved(false);
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Configuración
          </h1>

          <p className="text-sm text-muted-foreground">
            Configura los niveles de inventario
            según la rotación de cada producto.
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Niveles de stock
            </h2>

            <p className="text-sm text-muted-foreground">
              Estos valores se utilizarán como
              referencia para nuevos productos y
              alertas de inventario.
            </p>
          </div>

          <div className="space-y-6">
            {rotations.map((rotation) => {
              const config =
                values[rotation];

              const info =
                rotationInfo[rotation];

              return (
                <div
                  key={rotation}
                  className="rounded-xl border p-5"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold">
                      {info.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        Stock mínimo
                      </Label>

                      <Input
                        type="number"
                        min="0"
                        value={
                          config.minStock
                        }
                        onChange={(event) =>
                          handleChange(
                            rotation,
                            "minStock",
                            event.target.value
                          )
                        }
                      />

                      <p className="text-xs text-muted-foreground">
                        Cuando el stock llegue a
                        este nivel se generará
                        una alerta.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Stock máximo
                      </Label>

                      <Input
                        type="number"
                        min="0"
                        value={
                          config.maxStock
                        }
                        onChange={(event) =>
                          handleChange(
                            rotation,
                            "maxStock",
                            event.target.value
                          )
                        }
                      />

                      <p className="text-xs text-muted-foreground">
                        Nivel recomendado para
                        reabastecer el producto.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="font-medium">
                      Rango:
                    </span>{" "}
                    {config.minStock} —{" "}
                    {config.maxStock} unidades
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Deshacer cambios
            </Button>

            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar configuración
            </Button>
          </div>

          {saved && (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              Configuración guardada correctamente.
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}