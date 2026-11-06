"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Menú móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Buscador */}
      {/* <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Buscar productos..."
          className="pl-9"
        />
      </div> */}

      <div className="ml-auto flex items-center gap-2">
        {/* <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button> */}

        <div className="hidden items-center gap-3 border-l pl-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            A
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-muted-foreground">Inventario</p>
          </div>
        </div>
      </div>
    </header>
  );
}