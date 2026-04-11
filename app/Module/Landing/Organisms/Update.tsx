'use client';

import Icon from "../../Common/Components/Atoms/Icon";

export default function Update() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="updates">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3">
          <h2 className="text-4xl font-extrabold font-headline text-on-surface mb-6">
            What's New
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            We are constantly evolving to meet the needs of the modern academic
            landscape. Check out our latest improvements.
          </p>
          <div className="p-6 rounded-2xl bg-surface-container-low border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-primary">v1.0.2</span>
              <span className="text-xs px-2 py-1 bg-surface-container-high rounded text-on-surface-variant">
                Current Stable
              </span>
            </div>
            <p className="text-sm text-on-surface-variant italic">
              "The Faculty Empowerment Update"
            </p>
          </div>
        </div>
        <div className="md:w-2/3 space-y-6">
          <div className="group relative pl-8 pb-8 border-l-2 border-outline-variant/30">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface ring-4 ring-primary/10"></div>
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_8px_24px_rgba(44,42,81,0.04)] group-hover:shadow-lg transition-all">
              <h4 className="text-xl font-bold font-headline text-on-surface mb-4">
                Version 1.0.2 - Enhanced Reporting
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <Icon name="check_circle" className="text-primary !text-sm mt-1"/>
                  Integrated LaTeX support for mathematical research
                  questionnaires.
                </li>
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <Icon name="check_circle" className="text-primary !text-sm mt-1"/>
                  New PDF Export engine with automated faculty branding.
                </li>
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <Icon name="check_circle" className="text-primary !text-sm mt-1"/>
                  Improved session persistence for mobile users on unstable
                  campus Wi-Fi.
                </li>
              </ul>
            </div>
          </div>
          <div className="group relative pl-8 pb-8 border-l-2 border-outline-variant/30">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-outline-variant border-4 border-surface"></div>
            <div className="bg-surface p-8 rounded-3xl opacity-70">
              <h4 className="text-xl font-bold font-headline text-on-surface mb-4">
                Version 1.0.1 - Foundation Patch
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <Icon name="check_circle" className="text-outline !text-sm mt-1"/>
                  Initial Single Sign-On (SSO) integration for faculty portals.
                </li>
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <Icon name="check_circle" className="text-outline !text-sm mt-1"/>
                  Dark mode support for late-night research sessions.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
