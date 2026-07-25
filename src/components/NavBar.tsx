"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "홈" },
  { href: "/practice", label: "건반 연습" },
  { href: "/compose", label: "작곡 도우미" },
  { href: "/note", label: "음 맞추기" },
  { href: "/interval", label: "인터벌" },
  { href: "/chord", label: "코드" },
  { href: "/badges", label: "배지" },
  { href: "/stats", label: "통계" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeLink = LINKS.find((link) => link.href === pathname);

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sticky top-0 z-20">
      <nav className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-base font-bold text-zinc-900 dark:text-zinc-50 sm:text-lg"
        >
          🎵 절대음감
        </Link>

        <div className="flex items-center gap-2">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {activeLink?.label ?? "메뉴"}
              <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            {open && (
              <ul
                role="menu"
                className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                {LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className={`block px-4 py-2.5 text-sm font-medium ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
