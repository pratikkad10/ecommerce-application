import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAIN_NAV_LINKS } from "@/config/navigation";
import { NavLink } from "./NavLink";
import { IconButton } from "./IconButton";

export function TopNavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-sm dark:shadow-none w-full top-0 sticky z-50 transition-all duration-200 ease-in-out">
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
          {/* Brand */}
          <Link
            className="font-headline-md text-headline-md font-black tracking-tighter text-primary-container dark:text-primary-fixed-dim"
            to="/"
          >
            Kraya
          </Link>

          <nav className="hidden md:flex gap-lg items-center">
            {MAIN_NAV_LINKS.map((link) => (
              <NavLink key={link.label} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-sm">

            <Link to="/search">
              <IconButton icon="search" aria-label="Search" />
            </Link>
            <IconButton icon="favorite" aria-label="Wishlist" />
            <IconButton icon="shopping_cart" badge aria-label="Cart" />

            {/* Person icon / avatar */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon="account_circle"
                    aria-label="Account menu"
                    className="ring-2 ring-primary-container/30 ring-offset-1"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-surface rounded-2xl border border-outline-variant/50 shadow-2xl p-4 flex flex-col gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container/15 shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">person</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-on-surface text-sm truncate">
                        {user.firstName} {user.lastName ?? ""}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-container/10 text-primary uppercase tracking-wide">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 px-3 py-2.5 rounded-xl transition-colors w-full cursor-pointer disabled:opacity-60 outline-none"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    {isLoggingOut ? "Signing out…" : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon="login"
                    aria-label="Sign in"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-surface rounded-2xl border border-outline-variant/50 shadow-2xl p-2 z-50 flex flex-col gap-1">
                  <DropdownMenuItem
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-sm font-medium text-on-surface hover:bg-surface-container focus:bg-surface-container px-3 py-2.5 rounded-xl transition-colors cursor-pointer outline-none"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-2 text-sm font-medium text-on-surface hover:bg-surface-container focus:bg-surface-container px-3 py-2.5 rounded-xl transition-colors cursor-pointer outline-none"
                  >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Create Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

    </>
  );
}
