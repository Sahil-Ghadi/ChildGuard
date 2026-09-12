"use client";

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
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = user ? [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Register Case", path: "/register-case", icon: FilePlus },
    { name: "Verification", path: "/verification-desk", icon: CheckCircle2 },
    { name: "Active Alerts", path: "/public-alert", icon: Radio },
  ] : [
    { name: "Active Alerts", path: "/public-alert", icon: Radio },
    { name: "Report Sighting", path: "/report-a-sighting", icon: Camera },
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="h-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
              ChildGuard
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {user ? "Officer Grid" : "Public Portal"}
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {links.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all",
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-slate-500")} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Emergency 112 Shortcut */}
          <Button variant="destructive" size="sm" asChild className="h-9 rounded-lg font-semibold text-xs px-3 shadow-xs">
            <a href="tel:112" className="gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">112 Helpline</span>
              <span className="sm:hidden">112</span>
            </a>
          </Button>
          
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 leading-none">
                  {user.displayName?.split(" ")[0] || "Officer"}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-medium leading-tight">
                  Verified Dispatch
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="h-9 px-2.5 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-300 font-semibold text-xs gap-1.5 hover:bg-slate-50">
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                <span>Officer Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
