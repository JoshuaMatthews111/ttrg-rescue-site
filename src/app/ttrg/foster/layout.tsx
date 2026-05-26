import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foster a Dog — Team Trainers Rescue Group",
  description: "Open your home temporarily and help a rescue dog heal. Learn about our foster program.",
  openGraph: { title: "Foster a Dog — Team Trainers Rescue Group", description: "Open your home temporarily and help a rescue dog heal. Learn about our foster program." },
  twitter: { title: "Foster a Dog — Team Trainers Rescue Group", description: "Open your home temporarily and help a rescue dog heal. Learn about our foster program." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
