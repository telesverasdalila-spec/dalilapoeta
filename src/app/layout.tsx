import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Task 111: fontes locais (arquivos no cofre) — o build não depende mais da
// internet para buscar metadados no Google Fonts (a fornalha da Hostinger
// bloqueia/quebra essa busca; a Vercel também ganha robustez).
// inter-var.woff2 e cormorant-var.woff2 são fontes VARIÁVEIS oficiais do
// Google Fonts (mesmos pesos que antes: Inter 100-700, Cormorant 300-700).
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [{ path: "./fonts/inter-var.woff2", weight: "100 700", style: "normal" }],
});

const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [{ path: "./fonts/cormorant-var.woff2", weight: "300 700", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dalila-teles-poeta.vercel.app"),
  title: "Dalila Teles Veras",
  description: "Poeta, escritora e editora",
  openGraph: {
    title: "Dalila Teles Veras",
    description: "Poeta, escritora e editora — memorial da obra e da trajetória cultural",
    url: "https://dalila-teles-poeta.vercel.app",
    siteName: "Dalila Teles Veras",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-dalila.jpg",
        width: 1200,
        height: 630,
        alt: "Retrato artístico de Dalila Teles Veras",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dalila Teles Veras",
    description: "Poeta, escritora e editora",
    images: ["/og-dalila.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}