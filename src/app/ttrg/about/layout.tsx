import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TTRG — Our Mission and Story",
  description: "Learn about Team Trainers Rescue Group, our founder Lorenzo Miller, and our rescue mission.",
  openGraph: { title: "About TTRG — Our Mission and Story", description: "Learn about Team Trainers Rescue Group, our founder Lorenzo Miller, and our rescue mission." },
  twitter: { title: "About TTRG — Our Mission and Story", description: "Learn about Team Trainers Rescue Group, our founder Lorenzo Miller, and our rescue mission." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
