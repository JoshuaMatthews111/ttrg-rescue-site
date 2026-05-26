import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Journeys — Team Trainers Rescue Group",
  description: "Follow the rescue journey of every dog from rescue through rehabilitation to a forever home.",
  openGraph: { title: "Dog Journeys — Team Trainers Rescue Group", description: "Follow the rescue journey of every dog from rescue through rehabilitation to a forever home." },
  twitter: { title: "Dog Journeys — Team Trainers Rescue Group", description: "Follow the rescue journey of every dog from rescue through rehabilitation to a forever home." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
