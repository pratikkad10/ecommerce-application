import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAIN_NAV_LINKS } from "@/config/navigation";
import { NavLink } from "./NavLink";
import { IconButton } from "./IconButton";

export function TopNavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-gutter py-4">
        {/* Brand */}
        <a
          className="text-headline-md font-black text-primary tracking-tight hover:scale-105 transition-transform duration-200"
          href="#"
        >
          Kraya
        </a>

        {/* Navigation (Web) */}
        <nav className="hidden md:flex items-center gap-md">
          {MAIN_NAV_LINKS.map((link) => (
            <NavLink key={link.label} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-sm">
          {/* Search */}
          <div className="hidden md:block relative">
            <Input
              className="bg-surface-container-lowest border-outline-variant rounded-full py-2 pl-4 pr-10 text-body-md focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container transition-all w-64 shadow-[0_4px_12px_rgba(0,0,0,0.02)] h-auto outline-none"
              placeholder="Search..."
              type="text"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              search
            </span>
          </div>
          
          <IconButton icon="favorite" />
          <IconButton icon="shopping_cart" badge />
          <IconButton icon="person" />
          
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden text-primary hover:bg-transparent">
            <span className="material-symbols-outlined">menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
