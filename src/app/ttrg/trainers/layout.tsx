import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team — Team Trainers Rescue Group",
  description: "Meet the trainers, coordinators, and partners powering the TTRG rescue mission.",
  openGraph: { title: "Our Team — Team Trainers Rescue Group", description: "Meet the trainers, coordinators, and partners powering the TTRG rescue mission." },
  twitter: { title: "Our Team — Team Trainers Rescue Group", description: "Meet the trainers, coordinators, and partners powering the TTRG rescue mission." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
