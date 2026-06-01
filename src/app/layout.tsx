import type { Metadata } from "next";
import { Poppins, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lorenzo's Dog Training Team | Transform Chaos Into Confidence",
  description:
    "Professional dog training that restores peace, obedience, and trust between you and your dog. Over 40 years of experience. All breeds welcome. Serving nationwide.",
  keywords:
    "dog training, obedience training, behavioral modification, service dog training, Lorenzo's Dog Training Team",
  openGraph: {
    title: "Lorenzo's Dog Training Team | Transform Chaos Into Confidence",
    description:
      "Professional dog training that restores peace, obedience, and trust between you and your dog.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
