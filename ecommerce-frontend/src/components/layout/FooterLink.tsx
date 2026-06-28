export function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        className="text-label-sm text-on-surface-variant hover:text-primary hover:translate-x-1 transition-transform duration-200 inline-block"
        href={href}
      >
        {children}
      </a>
    </li>
  );
}
