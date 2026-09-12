"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Phone, 
  LogIn, 
  LogOut, 
  Radio, 
  Camera, 
  LayoutDashboard, 
  FilePlus, 
  CheckCircle2,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Register Case", path: "/register-case", icon: FilePlus },
    { name: "Verify Sightings", path: "/verification-desk", icon: CheckCircle2 },
    { name: "Active Alerts", path: "/public-alert", icon: Radio },
  ] : [
    { name: "Active Alerts", path: "/public-alert", icon: Radio },
    { name: "Report Sighting", path: "/report-a-sighting", icon: Camera },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="h-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-extrabold text-slate-900 tracking-tight text-base">
            ChildGuard
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-600" : "text-slate-400")} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Emergency 112 */}
          <Button variant="destructive" size="sm" asChild className="h-8 rounded-lg font-semibold text-xs px-2.5">
            <a href="tel:112" className="gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">112</span>
              <span className="sm:hidden">112</span>
            </a>
          </Button>
          
          {user ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="hidden md:inline-flex h-8 px-2.5 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Link href="/login" className="hidden md:inline-flex">
              <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 font-medium text-xs gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Officer Login</span>
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-in slide-in-from-top-1 duration-200">
          <nav className="px-4 py-3 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-2 border-t border-slate-100 mt-2">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 w-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Officer Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
