import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate — Team Trainers Rescue Group",
  description: "Support our mission. Every dollar helps rescue, rehabilitate, and rehome a dog in need.",
  openGraph: { title: "Donate — Team Trainers Rescue Group", description: "Support our mission. Every dollar helps rescue, rehabilitate, and rehome a dog in need." },
  twitter: { title: "Donate — Team Trainers Rescue Group", description: "Support our mission. Every dollar helps rescue, rehabilitate, and rehome a dog in need." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
