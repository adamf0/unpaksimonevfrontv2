"use client";

import Icon from "@/app/Module/Common/Components/Atoms/Icon";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";

export default function Hero() {
  return (
    <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto" id="home">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container">
            <Icon name="auto_awesome" className="!text-sm text-[#ffff02]" />
            Empowering Academic Growth
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Insightful Data, <br />
            <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
              Smarter Campus.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant">
            Streamlining survey data into actionable intelligence.
          </p>

          <AnimatedButton
            className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl"
            icon="arrow_forward"
          >
            Start Surveying
          </AnimatedButton>
        </div>

        <div className="relative">
          <img
            className="rounded-[2rem] shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb4no-ogAznPD9xcc-EkXlyQnYWy13pNPDI_KYLdwlymcXXw92l_mgoWhdwtMGJj1V-RbB2ZR06d_-xAAf_oOilH7j55YAayHl-BGxhFEsWq_9pCWFAUmNGDPo3KW7IdusLTxQGkXQIkTUZJC1k5Pd1xw27gqTP9VKH5fTZRza_DK8PnRW_bPKPAOS7UA-izdkAKA9arsUdfPxZakpgWcaPkRFVRL2NQA__9Um0Nax9VOET_NrdSB9MyZXA64TzAeGUypIFQp-hBI"
          />
        </div>
      </div>
    </section>
  );
}
