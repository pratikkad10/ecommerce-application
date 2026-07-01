import { Link, useLocation } from "react-router-dom";

export function NavLink({ href, label }: { href: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`font-label-md text-label-md transition-all duration-200 ease-in-out hover:scale-[1.02] ${
        isActive
          ? "text-primary-container dark:text-primary-fixed-dim border-b-2 border-primary-container dark:border-primary-fixed-dim pb-1"
          : "text-on-surface-variant dark:text-outline-variant hover:text-primary-container dark:hover:text-primary-fixed-dim"
      }`}
    >
      {label}
    </Link>
  );
}
