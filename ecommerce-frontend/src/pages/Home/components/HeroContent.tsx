import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustBadge } from "./TrustBadge";
import { Link } from "react-router-dom";

export function HeroContent() {
  return (
    <div className="space-y-lg text-center lg:text-left">
      <Badge variant="hero">
        <span className="material-symbols-outlined text-sm">
          local_shipping
        </span>{" "}
        Free Shipping Over ₹999
      </Badge>

      <h1 className="text-headline-lg-mobile md:text-display font-extrabold text-on-surface leading-tight">
        Everything You Love, <br className="hidden lg:block" />{" "}
        <span className="text-primary-container">Delivered.</span>
      </h1>

      <p className="text-body-lg text-on-surface-variant max-w-[576px] mx-auto lg:mx-0">
        Discover a curated selection of premium fashion, cutting-edge
        electronics, and essential home goods. Elevate your everyday with
        seamless shopping.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
        <Button variant="hero" size="hero" asChild>
          <Link to="/shop">Start Shopping</Link>
        </Button>
        <Button variant="heroOutline" size="hero" asChild>
          <Link to="/shop">Explore Categories</Link>
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-6 opacity-80">
        <TrustBadge icon="verified_user" text="Secure Payment" />
        <TrustBadge icon="currency_exchange" text="Easy Returns" />
        <TrustBadge icon="bolt" text="Fast Delivery" />
      </div>
    </div>
  );
}
