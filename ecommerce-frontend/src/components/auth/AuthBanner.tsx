import { Img } from "@/components/ui/image";

export function AuthBanner() {
  return (
    <div className="hidden lg:block lg:w-1/2 relative rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] min-h-[600px]">
      <Img
        variant="default"
        className="absolute inset-0 w-full h-full"
        alt="A premium, high-end e-commerce editorial photograph featuring a chic, minimalist living space or fashion scene."
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyK29ONywMbBxk1EVzrh43UxXxmwDgW0zruTiJJJZO66iVChoyfFLXO1py3FY3gFMxR6kqYxCJGZc5GGGJ4xKpZsS9Uo3ygxOc5i4zKW-Xe0OqxUd-ZvcPdfH3vRqIdqvuPt-lfcfRH8K6e2YbSsKozfcQr14_OSWGQoExe50_oPs9jGUXRgenJwZ86uSBNYnC6l2Wh7r_9Tu8OjYnFQzz44JoBRjC6mo3Y9faSRx-HD9QC1M7m1D1SwJ8Nr-Kdkmau6F-j29ldC1O"
      />
      <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 to-transparent"></div>
      <div className="absolute bottom-12 left-12 right-12 text-on-primary">
        <h2 className="text-headline-lg font-headline-lg mb-sm">Elevate Your Everyday.</h2>
        <p className="text-body-lg font-body-lg opacity-90 max-w-[448px]">
          Join millions of shoppers discovering premium fashion, cutting-edge electronics, and lifestyle essentials curated just for you.
        </p>
      </div>
    </div>
  );
}
