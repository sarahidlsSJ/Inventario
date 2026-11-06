"use client";

import { useState } from "react";

import {
  Menu,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Menú de escritorio */}
      <Sidebar />

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 h-full w-full bg-black/50"
            onClick={closeMobileMenu}
          />

          <div className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-background shadow-xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="font-semibold">
                Menú
              </span>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Cerrar menú"
                onClick={closeMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1">
              <Sidebar
                mobile
                onNavigate={closeMobileMenu}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative">
          <Header
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          {/* Botón adicional de menú solo para móvil */}
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            className="hidden"
          >
            <Menu />
          </button>
        </div>

        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}