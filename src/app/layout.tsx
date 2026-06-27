import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhishek & Nivedita | Wedding Invitation · 25 November 2026",
  description:
    "You are cordially invited to celebrate the wedding of Abhishek Gupta & Nivedita Jha on 25 November 2026 at Mapple Gold Banquets, Peeragarhi.",
  openGraph: {
    title: "Abhishek & Nivedita | Wedding Invitation",
    description: "Join us as we begin forever — 25 November 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable} ${pinyon.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
