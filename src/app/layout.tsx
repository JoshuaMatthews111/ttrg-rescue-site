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
  title: "Team Trainers Rescue Group — Rescue. Train. Rehome. Repeat.",
  description:
    "Nonprofit dog rescue in Cleveland, OH. We rescue, train, rehabilitate, and rehome dogs in need.",
  icons: {
    icon: "/favicon-ttrg.png",
    apple: "/favicon-ttrg.png",
  },
  openGraph: {
    title: "Team Trainers Rescue Group — Rescue. Train. Rehome. Repeat.",
    description:
      "Nonprofit dog rescue in Cleveland, OH. We rescue, train, rehabilitate, and rehome dogs in need.",
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
