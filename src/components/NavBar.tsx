"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "홈" },
  { href: "/practice", label: "건반 연습" },
  { href: "/note", label: "음 맞추기" },
  { href: "/interval", label: "인터벌" },
  { href: "/chord", label: "코드" },
  { href: "/stats", label: "통계" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sticky top-0 z-10">
      <nav className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-base font-bold text-zinc-900 dark:text-zinc-50 sm:text-lg"
        >
          🎵 절대음감
        </Link>
        <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className={`block whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-colors ${
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
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
