import { Button } from "@/components/ui/button";
import { FOOTER_COLUMNS } from "@/config/footer";
import { FooterColumn } from "./FooterColumn";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md max-w-container-max mx-auto px-gutter py-xl">
        <div className="col-span-2 lg:col-span-2 space-y-4">
          <a className="text-headline-sm font-bold text-primary" href="#">
            Kraya
          </a>
          <p className="text-body-md text-on-surface-variant max-w-[320px]">
            Your premium destination for everything you love, delivered with care.
          </p>
          <div className="flex gap-2 pt-2 -ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-highest"
              asChild
            >
              <a href="#">
                <span className="material-symbols-outlined">share</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container-highest"
              asChild
            >
              <a href="#">
                <span className="material-symbols-outlined">mail</span>
              </a>
            </Button>
          </div>
        </div>
        
        {FOOTER_COLUMNS.map((col) => (
          <FooterColumn key={col.title} title={col.title} links={col.links} />
        ))}
      </div>
      
      <div className="max-w-container-max mx-auto px-gutter py-4 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-label-sm text-on-surface-variant">
          © 2026 Kraya. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">payments</span>
          <span className="material-symbols-outlined text-xl">credit_card</span>
        </div>
      </div>
    </footer>
  );
}
