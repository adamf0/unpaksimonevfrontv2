"use client";

import { MenuItem } from "../../Attribut/MenuItem";
import Icon from "../Atoms/Icon";

type SidebarProps = {
  isOpen: boolean;
  MENU_ITEMS: MenuItem[];
  BOTTOM_ITEMS: MenuItem[];
};

export default function Sidebar({
  isOpen,
  MENU_ITEMS,
  BOTTOM_ITEMS,
}: SidebarProps) {
  return (
    <aside
      id="sidebar"
      className={`
        fixed left-0 top-0 h-screen w-64 bg-[#f3eeff] tonal-shift-no-border z-50 
        transform transition-transform duration-300 
        flex flex-col p-4
        overflow-y-auto overscroll-y-contain

        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="mb-8 px-4">
        <span className="text-xl font-black text-indigo-700">
          Unpak Simonev
        </span>
        <span className="text-xs text-slate-500 block">Admin Portal</span>
      </div>

      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            active={item.active}
            onClick={item.onClick}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>

      <div className="mt-12 border-t border-black/20 pt-4 space-y-1 md:mt-auto">
        {BOTTOM_ITEMS.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            danger={item.danger}
            onClick={item.onClick}
          >
            {item.label}
          </NavItem>
        ))}
      </div>
    </aside>
  );
}

function NavItem({ children, icon, active, danger, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 
        font-['Plus_Jakarta_Sans'] font-medium text-sm
        transition-all duration-200 hover:translate-x-1

        ${
          active
            ? "text-indigo-700 bg-white rounded-xl shadow-sm"
            : danger
            ? "text-error hover:bg-error/5"
            : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        }
      `}
    >
      <Icon name={icon} />
      {children}
    </button>
  );
}