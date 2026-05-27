import type { Metadata } from "next";
import TTRGShell from "@/components/ttrg/TTRGShell";

export const metadata: Metadata = {
  title: "Team Trainers Rescue Group — Rescue. Train. Rehome. Repeat.",
  description: "Nonprofit dog rescue in Cleveland, OH. We rescue, train, rehabilitate, and rehome dogs in need.",
  icons: {
    icon: "/favicon-ttrg.jpeg",
    apple: "/favicon-ttrg.jpeg",
  },
  openGraph: {
    title: "Team Trainers Rescue Group — Rescue. Train. Rehome. Repeat.",
    description: "Nonprofit dog rescue in Cleveland, OH. We rescue, train, rehabilitate, and rehome dogs in need.",
    type: "website",
  },
  twitter: {
    title: "Team Trainers Rescue Group — Rescue. Train. Rehome. Repeat.",
    description: "Nonprofit dog rescue in Cleveland, OH. We rescue, train, rehabilitate, and rehome dogs in need.",
  },
};

export default function TTRGLayout({ children }: { children: React.ReactNode }) {
  return <TTRGShell>{children}</TTRGShell>;
}
