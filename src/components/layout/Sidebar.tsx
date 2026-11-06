"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  History,
  Settings,
  AlertTriangle,
  Package,
} from "lucide-react";

const menuItems = [
  // {
  //   label: "Dashboard",
  //   href: "/dashboard",
  //   icon: BarChart3,
  // },
  {
    label: "Productos",
    href: "/products",
    icon: Box,
  },
  // {
  //   label: "Movimientos",
  //   href: "/movements",
  //   icon: History,
  // },
  {
    label: "Stock bajo",
    href: "/alerts",
    icon: AlertTriangle,
  },
];

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-full flex-col bg-background"
          : "hidden h-screen w-64 shrink-0 flex-col border-r bg-background md:flex"
      }
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package className="h-5 w-5" />
        </div>

        <div>
          <h1 className="font-semibold">
            Inventario
          </h1>

          <p className="text-xs text-muted-foreground">
            Sistema de inventario
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-medium uppercase text-muted-foreground">
          Principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === pathname ||
            (item.href === "/products" &&
              pathname === "/products");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={linkClass(active)}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t p-4">
        <Link
          href="/settings"
          onClick={onNavigate}
          className={linkClass(
            pathname === "/settings"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />

          Configuración
        </Link>
      </div>
    </aside>
  );
}