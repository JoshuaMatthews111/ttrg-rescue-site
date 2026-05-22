import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TLM Enterprises | Master Dashboard",
  description: "Centralized management for all TLM Enterprises brands",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
