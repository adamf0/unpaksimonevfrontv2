'use client';

export default function CTA() {
  return (
    <section className="px-6 py-12 pb-32">
      <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden bg-on-surface py-20 px-8 text-center text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline mb-6">
            Start managing your campus data more intelligently
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
            Unpak Simonev helps you process, understand, and turn questionnaire
            data into effective, data-driven decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
