import { FooterLink } from "./FooterLink";

export function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-label-md text-on-surface">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <FooterLink key={link.label} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </ul>
    </div>
  );
}
