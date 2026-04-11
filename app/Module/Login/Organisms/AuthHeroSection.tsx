import ImageOverlay from "../../Common/Components/Atoms/ImageOverlayAtom";
import FeatureItem from "../Molecules/FeatureItem";
import HeaderBrand from "../Molecules/HeaderBrand";
import QuoteBlock from "../Molecules/QuoteBlock";

export default function AuthHeroSection() {
  return (
    <section className="hidden lg:flex relative w-1/2 bg-primary overflow-hidden">
      <ImageOverlay
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuArkPEtieYqIpreuP7MA5PH3FKmRMr_DHwebwFaqgaHTpqTUQix9TqT1UMjjGyFANm058ook9hf8BMpuurCzqLEAlZkkuHpfYGQM6dfsM3uzV4p9JkfFW2qfzor6n4vHl0JZcaZ5IjphOGyPnox-R8tESrAI3pXVzD-f030kshJ7kxCfisQoKriIDr9-5TliJ55-XKyDW7nLeHU_VX3qLEpbD_ZmO-9yMsdCyFiRnei7hVvIUTXOG-w4LROye6zP6nCcTykilWsUxQ"
        alt="Modern university library"
        dataAlt="Modern university library with soft natural lighting, students collaborating on sleek laptops in a minimalist high-tech academic setting"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>

      <div className="relative z-10 flex flex-col justify-between p-16 w-full text-on-primary">
        <HeaderBrand />
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <h2 className="font-headline text-6xl font-bold leading-tight">
              Universitas Pakuan <br />
              Awaits.
            </h2>
            <div className="h-1.5 w-24 bg-primary-container rounded-full"></div>
          </div>
          <QuoteBlock
            quote="The pursuit of knowledge is a quest without end, but the
                      environment in which we seek it defines our journey."
            author="Lembaga Penjamin Mutu"
          />
        </div>
        <div className="flex items-center gap-8 text-sm font-medium opacity-80">
          <FeatureItem icon="verified_user" label="Secure Infrastructure" />
          <FeatureItem icon="cloud" label="Global Access" />
        </div>
      </div>
    </section>
  );
}
