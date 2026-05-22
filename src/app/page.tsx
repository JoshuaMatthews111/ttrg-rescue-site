import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import Trainers from "@/components/Trainers";
import SocialProof from "@/components/SocialProof";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import AdminToggle from "@/components/AdminToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navigation />
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <PainPoints />
        <Testimonials />
        <Services />
        <Trainers />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTA />
      <AdminToggle />
    </div>
  );
}
