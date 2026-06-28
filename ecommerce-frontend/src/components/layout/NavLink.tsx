export function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-label-md"
      href={href}
    >
      {label}
    </a>
  );
}
