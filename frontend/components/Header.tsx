"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, signInWithGoogle, logout } = useAuth();

  const links = [
    { name: "Register Case", path: "/register-case" },
    { name: "Active Alerts", path: "/public-alert" },
    { name: "Report a Sighting", path: "/report-a-sighting" },
    { name: "Tactical Command", path: "/" },
    { name: "Verification Desk", path: "/verification-desk" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(11,28,48,0.03)] bg-surface-container-lowest">
      <div className="h-20 max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
        
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            alt="Brand logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VpF3Q4Yz5YmPO2auLEdfJNL37ayoT_HZK8ftiHyJDborc5bc4J8c57KI8N8hr6BM-AquI4VL7FLmMRJVzjqU1YBUdLDziiskMPfJohCx0KOL1Yfib9J18RekRJZkt3vzgLTrDOBFInfb9nzaVxGxFlSIME-E4X94FCh-4mipBhtREBEYZ16LNbUDmruC6O5Krh5cjkv-yOcY12wvSkINd3EiI2_uPBjVpkZhXRyZNk-0HH7SuIyO54Uw"
          />
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
            ChildGuard
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 p-1.5 rounded-full bg-surface-container-low/80 border border-outline-variant/30">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={
                  isActive
                    ? "px-4 py-2 rounded-full transition-all bg-primary-container text-on-primary font-bold shadow-sm font-label-md text-label-md"
                    : "font-label-md text-label-md px-4 py-2 rounded-full text-on-surface-variant hover:text-on-surface transition-all"
                }
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-sm shrink-0">
          <a
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-error-container text-on-error-container hover:bg-tertiary-fixed hover:text-on-tertiary-fixed font-label-md text-label-md border border-error/20 shadow-xs transition-all"
            href="tel:112"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>112 Emergency</span>
          </a>
          
          {user ? (
            <div 
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary cursor-pointer hover:bg-primary-container transition-all shadow-sm overflow-hidden border border-outline-variant/30"
              onClick={logout}
              title="Sign Out"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm border border-outline-variant/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
