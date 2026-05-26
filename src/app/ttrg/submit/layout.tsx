import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommend a Dog — Team Trainers Rescue Group",
  description: "Know a dog that needs rescue? Recommend them for our program.",
  openGraph: { title: "Recommend a Dog — Team Trainers Rescue Group", description: "Know a dog that needs rescue? Recommend them for our program." },
  twitter: { title: "Recommend a Dog — Team Trainers Rescue Group", description: "Know a dog that needs rescue? Recommend them for our program." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
