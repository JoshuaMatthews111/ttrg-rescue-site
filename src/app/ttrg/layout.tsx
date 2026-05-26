import type { Metadata } from "next";
import TTRGShell from "@/components/ttrg/TTRGShell";

export const metadata: Metadata = {
  title: "Team Trainers Rescue Group — Rescue. Rehabilitate. Rehome. Repeat.",
  description: "Nonprofit dog rescue in Cleveland, OH. We rescue, rehabilitate, and rehome dogs in need.",
  openGraph: {
    title: "Team Trainers Rescue Group — Rescue. Rehabilitate. Rehome. Repeat.",
    description: "Nonprofit dog rescue in Cleveland, OH. We rescue, rehabilitate, and rehome dogs in need.",
    type: "website",
  },
  twitter: {
    title: "Team Trainers Rescue Group — Rescue. Rehabilitate. Rehome. Repeat.",
    description: "Nonprofit dog rescue in Cleveland, OH. We rescue, rehabilitate, and rehome dogs in need.",
  },
};

export default function TTRGLayout({ children }: { children: React.ReactNode }) {
  return <TTRGShell>{children}</TTRGShell>;
}
