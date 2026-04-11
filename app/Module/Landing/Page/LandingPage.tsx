'use client';

import CTA from "../Organisms/CTS";
import Footers from "../Organisms/Footers";
import Header from "../Organisms/Header";
import Hero from "../Organisms/Hero";
import Update from "../Organisms/Update";
import Vision from "../Organisms/Vision";

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Header />

      <main className="flex-grow pt-24">
        <Hero />

        <Vision/>

        <Update/>

        <CTA/>
      </main>

      <Header isMobile />

      <Footers />
    </div>
  );
}
