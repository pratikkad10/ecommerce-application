import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  LogOut,
  ChevronLeft,
  Menu,
  Store,
} from "lucide-react";
import { useState, useCallback } from "react";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products", end: false },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders", end: false },
  { to: "/admin/users", icon: Users, label: "Users", end: false },
  { to: "/admin/categories", icon: FolderTree, label: "Categories", end: false },
] as const;

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleBackToStore = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#07070b]">
      {/* ── Mobile Overlay ─────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-white/6 bg-[#0c0c14]/95 backdrop-blur-xl
          transition-all duration-300 ease-in-out
          lg:static lg:z-auto
          ${isCollapsed ? "w-[72px]" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo Area ───────────────────────────── */}
        <div className="flex h-16 items-center justify-between border-b border-white/6 px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-amber-500">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-wide text-white whitespace-nowrap">
                KRAYA ADMIN
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-amber-500">
              <Store className="h-4 w-4 text-white" />
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden rounded-md p-1 text-white/40 transition-colors hover:bg-white/6 hover:text-white/80 lg:flex"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* ── Navigation ──────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(255,122,0,0.15)]"
                      : "text-white/50 hover:bg-white/4 hover:text-white/80"
                    }
                    ${isCollapsed ? "justify-center px-0" : ""}`
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!isCollapsed && <span>{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Bottom Section ──────────────────────── */}
        <div className="border-t border-white/6 p-3">
          <button
            onClick={handleBackToStore}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/4 hover:text-white/80 ${isCollapsed ? "justify-center px-0" : ""}`}
            aria-label="Back to store"
          >
            <Store className="h-[18px] w-[18px] shrink-0" />
            {!isCollapsed && <span>Back to Store</span>}
          </button>

          {/* ── User Info ─────────────────────────── */}
          {!isCollapsed && (
            <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-amber-500/80 text-xs font-bold text-white">
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white/80">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-[10px] text-white/40">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="shrink-0 rounded-md p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
              aria-label="Logout"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Top Bar ──────────────────────────────── */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/6 bg-[#0c0c14]/80 px-4 backdrop-blur-xl lg:px-6">
          <button
            onClick={toggleMobile}
            className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/6 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:flex">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Admin Panel
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-[#07070b] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
