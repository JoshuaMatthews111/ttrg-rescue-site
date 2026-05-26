import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Stories — Team Trainers Rescue Group",
  description: "Real dogs. Real transformation. Watch rescue journeys and read adoption success stories.",
  openGraph: { title: "Success Stories — Team Trainers Rescue Group", description: "Real dogs. Real transformation. Watch rescue journeys and read adoption success stories." },
  twitter: { title: "Success Stories — Team Trainers Rescue Group", description: "Real dogs. Real transformation. Watch rescue journeys and read adoption success stories." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
