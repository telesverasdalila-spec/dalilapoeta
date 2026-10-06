import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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