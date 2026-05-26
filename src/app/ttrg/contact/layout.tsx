import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Team Trainers Rescue Group",
  description: "Get in touch with Team Trainers Rescue Group. Questions about adoption, fostering, volunteering, or partnerships.",
  openGraph: { title: "Contact Us — Team Trainers Rescue Group", description: "Get in touch with Team Trainers Rescue Group. Questions about adoption, fostering, volunteering, or partnerships." },
  twitter: { title: "Contact Us — Team Trainers Rescue Group", description: "Get in touch with Team Trainers Rescue Group. Questions about adoption, fostering, volunteering, or partnerships." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
