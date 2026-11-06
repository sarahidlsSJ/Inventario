import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Box,
  PackageX,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";

const lowStockProducts = [
  {
    name: 'Tornillo 1/4"',
    type: "Consumible",
    rotation: "Alta",
    stock: 95,
    minimum: 100,
    maximum: 500,
  },
  {
    name: "Taladro Bosch",
    type: "Herramienta",
    rotation: "Baja",
    stock: 0,
    minimum: 1,
    maximum: 5,
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Resumen general de tu inventario.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Productos
              </CardTitle>

              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">124</div>

              <p className="text-xs text-muted-foreground">
                Productos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Stock disponible
              </CardTitle>

              <PackageX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">2,458</div>

              <p className="text-xs text-muted-foreground">
                Unidades disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Stock bajo
              </CardTitle>

              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">8</div>

              <p className="text-xs text-muted-foreground">
                Necesitan atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Agotados
              </CardTitle>

              <PackageX className="h-4 w-4 text-destructive" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">2</div>

              <p className="text-xs text-muted-foreground">
                Sin existencias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Productos con stock bajo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Necesitan reabastecimiento</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Productos que alcanzaron o están por debajo de su stock
                  mínimo.
                </p>
              </div>

              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {lowStockProducts.map((product) => {
              const purchaseAmount =
                product.maximum - product.stock;

              const isOutOfStock = product.stock === 0;

              return (
                <div
                  key={product.name}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">
                        {product.name}
                      </h3>

                      <Badge variant="outline">
                        {product.type}
                      </Badge>

                      <Badge variant="secondary">
                        Rotación {product.rotation}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Stock actual:{" "}
                      <span className="font-medium text-foreground">
                        {product.stock}
                      </span>{" "}
                      / mínimo {product.minimum}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isOutOfStock ? (
                      <Badge variant="destructive">
                        Agotado
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Stock bajo
                      </Badge>
                    )}

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Comprar aproximadamente
                      </p>

                      <p className="font-semibold">
                        {purchaseAmount} unidades
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Movimientos */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Entradas recientes
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <ArrowDown className="h-4 w-4" />
                </div>

                <div>
                  <p className="font-medium">
                    Tornillos 1/4"
                  </p>

                  <p className="text-sm text-muted-foreground">
                    +200 unidades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Salidas recientes
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <ArrowUp className="h-4 w-4" />
                </div>

                <div>
                  <p className="font-medium">
                    Clavos 2"
                  </p>

                  <p className="text-sm text-muted-foreground">
                    -50 unidades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}