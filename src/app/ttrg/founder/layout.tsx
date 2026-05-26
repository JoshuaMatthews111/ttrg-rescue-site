import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorenzo Miller — Founder of Team Trainers Rescue Group",
  description: "40+ years of rescuing, training, and transforming dogs. Read Lorenzo's full story.",
  openGraph: { title: "Lorenzo Miller — Founder of Team Trainers Rescue Group", description: "40+ years of rescuing, training, and transforming dogs. Read Lorenzo's full story." },
  twitter: { title: "Lorenzo Miller — Founder of Team Trainers Rescue Group", description: "40+ years of rescuing, training, and transforming dogs. Read Lorenzo's full story." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
