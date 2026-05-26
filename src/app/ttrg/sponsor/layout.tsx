import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dogs in Our Care — Team Trainers Rescue Group",
  description: "Meet the dogs currently in our rescue program. Sponsor, foster, or adopt.",
  openGraph: { title: "Dogs in Our Care — Team Trainers Rescue Group", description: "Meet the dogs currently in our rescue program. Sponsor, foster, or adopt." },
  twitter: { title: "Dogs in Our Care — Team Trainers Rescue Group", description: "Meet the dogs currently in our rescue program. Sponsor, foster, or adopt." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
