import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Network | Connect. Collaborate. Elevate.",
  description: "A premium business network built for growth and opportunity.",
};

export default function SelectNetworkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
