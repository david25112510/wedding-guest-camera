import type { Metadata } from "next";
import "./globals.css";
import "./mural-interactions.css";
import "./luxury-mural.css";

export const metadata: Metadata = {
  title: "Lidieyne & Alexandre | 19.09.2026",
  description: "Registre e compartilhe os momentos do casamento de Lidieyne e Alexandre.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
