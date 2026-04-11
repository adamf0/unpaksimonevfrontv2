"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Organisms/Sidebar";
import Header from "../Organisms/Header";
import { MenuItem } from "../../Attribut/MenuItem";
import { usePathname, useRouter } from "next/navigation";

export default function AdminPanelTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((v) => !v);
  const closeSidebar = () => setIsOpen(false);

  // auto handle resize (ganti script lama)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MENU_ITEMS: MenuItem[] = [
    {
      icon: "dashboard",
      label: "Dashboard",
      active: pathname == "/dashboard",
      onClick: () => {
        closeSidebar();
        router.push("/dashboard");
      },
    },
    {
      icon: "inventory_2",
      label: "Account",
      active: pathname == "/account",
      onClick: () => {
        closeSidebar();
        router.push("/account");
      },
    },
    {
      icon: "inventory_2",
      label: "Bank Soal",
      active: pathname == "/banksoal",
      onClick: () => {
        closeSidebar();
        router.push("/banksoal");
      },
    },
    {
      icon: "category",
      label: "Kategori",
      active: pathname == "/kategori",
      onClick: () => {
        closeSidebar();
        router.push("/kategori");
      },
    },
    {
      icon: "description",
      label: "Template Kuesioner",
      active: pathname == "/template",
      onClick: () => {
        closeSidebar();
        router.push("/template");
      },
    },
    {
      icon: "analytics",
      label: "Laporan",
      active: pathname == "/laporan",
      onClick: () => {
        closeSidebar();
        router.push("/laporan");
      },
    },
    {
      icon: "settings",
      label: "Setting",
      active: pathname == "/setting",
      onClick: () => {
        closeSidebar();
        router.push("/setting");
      },
    },
  ];

  const BOTTOM_ITEMS: MenuItem[] = [
    {
      icon: "help_outline",
      label: "Support",
      active: pathname == "/help",
      onClick: () => {
        closeSidebar();
        router.push("/help");
      },
    },
    {
      icon: "logout",
      label: "Logout",
      danger: true,
      onClick: () => {
        closeSidebar();
        router.push("/logout");
      },
    },
  ];
  return (
    <div className="antialiased">
      <Sidebar
        isOpen={isOpen}
        MENU_ITEMS={MENU_ITEMS}
        BOTTOM_ITEMS={BOTTOM_ITEMS}
      />

      {/* OVERLAY */}
      <div
        onClick={closeSidebar}
        className={`
    fixed inset-0 bg-black/40 z-40 md:hidden
    transition-opacity duration-300
    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
  `}
      />

      <main className="md:ml-64 min-h-screen text-on-surface">
        <Header
          onToggleSidebar={toggleSidebar}
          title=""
          user={{
            name: "Admin Utama",
            role: "Super Administrator",
          }}
        />

        <div className="py-8 max-w-7xl mx-12 space-y-10">{children}</div>
      </main>
    </div>
  );
}
