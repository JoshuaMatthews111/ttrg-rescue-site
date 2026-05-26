import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved — Team Trainers Rescue Group",
  description: "Adopt, foster, volunteer, train, sponsor, or partner with our rescue mission.",
  openGraph: { title: "Get Involved — Team Trainers Rescue Group", description: "Adopt, foster, volunteer, train, sponsor, or partner with our rescue mission." },
  twitter: { title: "Get Involved — Team Trainers Rescue Group", description: "Adopt, foster, volunteer, train, sponsor, or partner with our rescue mission." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
