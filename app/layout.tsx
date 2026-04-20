import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Arth Saathi — अर्थ साथी",
  description: "Fixed Deposit advisor in Hindi, Bhojpuri & Awadhi",
  manifest: "/manifest.json",
  themeColor: "#f97316"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`h-full ${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden bg-ink-50 font-body antialiased">{children}</body>
    </html>
  );
}
