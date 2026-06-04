"use client";

import Icon from "../../Common/Components/Atoms/Icon";

const updates = [
  {
    version: "2.0.1",
    title: "Future Patch",
    status: "future",
    items: ["Apply Integrated SSO"],
  },
  {
    version: "2.0.0",
    title: "Enhancement Patch",
    status: "stable",
    items: [
      "Export Report Feature",
      "User Experience (UX) Improvements",
      "System Performance Optimization",
      "Security Enhancements",
      "Stakeholder Management Module",
      "BI Dashboard & Report Data Optimization",
    ],
  },
  {
    version: "1.0.0",
    title: "Initial Release",
    status: "legacy",
    items: ["All Core Requirement Features"],
  },
];

export default function Update() {
  const currentVersion = "2.0.0";

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="updates">
      <div className="flex flex-col md:flex-row gap-16">
        {/* LEFT */}
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
              <span className="font-bold text-primary">
                v{currentVersion}
              </span>

              <span className="text-xs px-2 py-1 rounded bg-surface-container-high text-on-surface-variant">
                Current Stable
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-2/3">
          {updates.map((update, index) => {
            const isStable = update.status === "stable";

            return (
              <div
                key={update.version}
                className={`relative pl-8 ${
                  index !== updates.length - 1
                    ? "pb-8 border-l-2 border-outline-variant/30"
                    : ""
                }`}
              >
                {/* TIMELINE DOT */}
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-surface ${
                    isStable
                      ? "bg-primary ring-4 ring-primary/10"
                      : "bg-outline-variant"
                  }`}
                />

                {/* CARD */}
                <div
                  className={`rounded-3xl p-8 transition-all ${
                    isStable
                      ? "bg-surface-container-lowest shadow-[0_8px_24px_rgba(44,42,81,0.04)] hover:shadow-lg"
                      : "bg-surface opacity-70"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <h4 className="text-xl font-bold font-headline text-on-surface">
                      Version {update.version}
                    </h4>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        update.status === "stable"
                          ? "bg-primary/10 text-primary"
                          : update.status === "future"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {update.title}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {update.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-on-surface-variant"
                      >
                        <Icon
                          name="check_circle"
                          className={`!text-sm mt-1 ${
                            isStable
                              ? "text-primary"
                              : "text-outline"
                          }`}
                        />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}