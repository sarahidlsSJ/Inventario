import type { Metadata, Viewport } from "next";
import "./globals.css";

import { InventoryProvider } from "@/context/InventoryContext";

export const metadata: Metadata = {
  title: "Inventario",
  description: "Sistema de gestión de inventario",

  applicationName: "Inventario",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Inventario",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#171717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <InventoryProvider>
          {children}
        </InventoryProvider>
      </body>
    </html>
  );
}