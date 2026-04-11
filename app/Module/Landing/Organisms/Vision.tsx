"use client";

import Icon from "../../Common/Components/Atoms/Icon";

export default function Vision() {
  return (
    <section
      className="bg-surface-container-low py-24 w-full overflow-hidden"
      id="vision"
    >
      <div className="px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-extrabold font-headline text-on-surface">
            Designed for Modern Academia
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Our vision is to foster an environment where every voice contributes
            to a better learning experience through cutting-edge technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="md:col-span-2 p-8 rounded-3xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] hover:translate-y-[-4px] transition-transform flex flex-col justify-between min-h-[320px]">
            <div>
              <span className="p-3 bg-indigo-50 text-primary rounded-2xl inline-block mb-6">
                <Icon name="analytics" className="!text-3xl" />
              </span>
              <h3 className="text-2xl font-bold font-headline mb-3">
                Real-time Analytics
              </h3>
              <p className="text-on-surface-variant">
                Instant processing of questionnaire data with visual
                representations that make complex trends easy to understand at a
                glance.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-primary text-on-primary shadow-xl flex flex-col justify-center text-center hover:translate-y-[-4px] transition-transform">
            <Icon name="lock" className="!text-6xl mb-6 opacity-40" />
            <h3 className="text-2xl font-bold font-headline mb-3">
              Privacy First
            </h3>
            <p className="text-on-primary/80">
              Anonymous submissions backed by enterprise-grade encryption to
              ensure student trust and data integrity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] hover:translate-y-[-4px] transition-transform">
            <span className="p-3 bg-indigo-50 text-primary rounded-2xl inline-block mb-6">
              <Icon name="diversity_3" className="!text-3xl" />
            </span>
            <h3 className="text-xl font-bold font-headline mb-2">
              Collaboration
            </h3>
            <p className="text-on-surface-variant">
              Departments can share insights and co-author templates for
              university-wide consistency.
            </p>
          </div>
          <div className="md:col-span-2 p-8 rounded-3xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] hover:translate-y-[-4px] transition-transform flex flex-col md:flex-row gap-8 items-center overflow-hidden">
            <div className="flex-1">
              <h3 className="text-2xl font-bold font-headline mb-3">
                Universal Accessibility
              </h3>
              <p className="text-on-surface-variant">
                Our mission is to ensure every student can participate,
                regardless of device or ability. Optimized for WCAG 2.1
                compliance.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-48 rounded-2xl bg-indigo-100 overflow-hidden">
              <img
                alt="Student Access"
                className="w-full h-full object-cover"
                data-alt="diverse students working on laptops in a bright modern campus library with soft natural lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcYI1ksjt1Ho5gFwHWWV3AWxq8iiObvJp3ogbGNLUfSRpuMI4YGAEg4AoYWsouwPiAia5vQhiAi5IuuJEGqJbAEBOM3ngOT9Yw15-nKrPZKXWESsFV1WI2HG3jiiSJKaiIMpNUvUyXQH7amemFSq1v7wUEa2SB5TcFe1E9haX520BOICf-yqturxCPsSKk7xisuEU8fZIw0LKYuv-ZT1J1SJG9vPuUOT4_DUMM2sz5T3HCBoNaFvDALjaZ6tfBhJH_1b9o0SRtDjE"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
