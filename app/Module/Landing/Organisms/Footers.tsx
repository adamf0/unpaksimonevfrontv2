"use client";

import Icon from "../../Common/Components/Atoms/Icon";

export default function Footers() {
  return (
    <footer className="bg-surface-container-highest/30 py-12 px-6 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Icon name="school" className={`!text-4xl text-primary`} />

          <span className="text-xl font-bold text-on-surface font-headline">
            Unpak Simonev
          </span>
        </div>

        {/* Copyright */}
        <p className="text-sm text-on-surface-variant">
          © 2026 Unpak Simonev. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
