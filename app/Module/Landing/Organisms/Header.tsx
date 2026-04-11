"use client";

import Icon from "../../Common/Components/Atoms/Icon";
import NavBarItemMobile from "../Molecules/NavBarItemMobile";
import NavItem from "../Molecules/NavItem";

export default function Header({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-t border-slate-200">
        <div className="flex px-2 pb-4 pt-2 gap-1">
          <NavBarItemMobile label="Home" href="#home" active />
          <NavBarItemMobile label="Mission" href="#vision" />
          <NavBarItemMobile label="What's New" href="#updates" />
        </div>
      </nav>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-indigo-50/80 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)]">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Icon name="school" className={`leading-none text-indigo-600`} />
          <span className="font-bold text-indigo-900">Unpak Simonev</span>
        </div>

        <div className="hidden md:flex gap-6">
          <NavItem href="#home" active>
            Home
          </NavItem>
          <NavItem href="#vision">Mission</NavItem>
          <NavItem href="#updates">What's New</NavItem>
        </div>
      </nav>
    </header>
  );
}
