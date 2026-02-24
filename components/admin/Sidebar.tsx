"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Medicine Inventory",
    href: "/admin/medicines",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9h6.61a2 2 0 0 1 2 2v2" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
        <circle cx="18" cy="18" r="3" />
      </svg>
    ),
  },
  {
    label: "Medicine GRN",
    href: "/admin/medicine-grn",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: "Medicine",
    href: "/admin/medicine",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9h6.61a2 2 0 0 1 2 2v2" />
        <path d="M15 20h4a2 2 0 0 0 2-2V8" />
        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 text-white",
          "flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h1 className="text-base font-bold tracking-tight">
            💊 Medicine App
          </h1>
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 pt-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                ].join(" ")}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
