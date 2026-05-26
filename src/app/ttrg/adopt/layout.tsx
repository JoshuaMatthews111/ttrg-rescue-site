import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adopt a Dog — Team Trainers Rescue Group",
  description: "Give a rescue dog a permanent loving home. View available dogs and apply.",
  openGraph: { title: "Adopt a Dog — Team Trainers Rescue Group", description: "Give a rescue dog a permanent loving home. View available dogs and apply." },
  twitter: { title: "Adopt a Dog — Team Trainers Rescue Group", description: "Give a rescue dog a permanent loving home. View available dogs and apply." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
