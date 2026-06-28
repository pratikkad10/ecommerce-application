import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/ui/image';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="grow flex items-center justify-center pt-xl pb-xl px-margin-mobile md:px-gutter relative overflow-hidden bg-surface">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary-fixed rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-secondary-fixed rounded-full mix-blend-multiply filter blur-[100px] opacity-60"
        ></div>
      </div>

      <div className="max-w-container-max mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg md:gap-xl items-center">

          {/* Illustration Side */}
          <div className="order-2 lg:order-1 flex justify-center floating-animation">
            <div className="relative w-full max-w-[400px] aspect-square">
              <Img
                className="object-cover rounded-xl shadow-[0_20px_60px_rgba(153,71,0,0.15)] bg-surface-container w-full h-full"
                alt="A highly stylized, premium 3D illustration of an elegant, slightly battered luxury shopping box or package sitting alone in an ethereal, soft-lit studio space. The box has a vibrant orange ribbon. The lighting is soft and cinematic, casting gentle shadows to create a minimalist, modern e-commerce aesthetic. The overall mood is whimsical but sophisticated, perfectly fitting a high-end retail 404 page error."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgNYmG6W1jz-ibnIwc3Lypf9D7psTcbYEUq5WSKOLlCkHl038Da7jvCqbED_foxkO4H8jrH3xZ4GVKY1mV5X1xHsJztxGJ1jv0Ol8NqjOngUtR-UC8xsZNqeamDzFPyyMhNyAn_oHTmC7qiqpcKs9mDfnH0gE97FXODbsa4sF8sQawomELxm2yuNzT0IqjWvh_0MzXur9pkzm7Jeh8EcQEPQ-SqgDiF7OhLPD17JMjuYRwzPCkNFgxi4lVxO-VBzC8E5St33Pv9F8z"
              />
              {/* Decorative floating badges */}
              <div className="absolute top-10 -right-8 bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-full p-sm flex items-center justify-center hover:scale-105 transition-transform duration-200">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_shipping
                </span>
              </div>
              <div className="absolute bottom-20 -left-6 bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-full p-sm flex items-center justify-center hover:scale-105 transition-transform duration-200">
                <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shopping_bag
                </span>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 flex flex-col justify-center space-y-md text-center lg:text-left glass-panel rounded-[2rem] p-lg w-full">

            {/* Error Code & Brand Context */}
            <div className="flex items-center space-x-sm opacity-80 mb-sm mx-auto lg:mx-0">
              <span className="font-headline-md text-headline-md font-black tracking-tight text-primary">Kraya</span>
              <div className="h-4 w-px bg-outline-variant"></div>
              <span className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">Error 404</span>
            </div>

            <h1 className="font-display text-display text-on-surface">
              Oops!<br />
              <span className="text-primary-container">Page Not Found</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[448px] mx-auto lg:mx-0">
              It looks like this link is out of style. The page you're looking for might have been removed, renamed, or is temporarily unavailable. Let's get you back to the latest collections.
            </p>

            <div className="flex flex-col sm:flex-row gap-sm w-full sm:w-auto pt-sm mx-auto lg:mx-0">
              <Button
                variant="hero"
                onClick={() => navigate('/')}
                className="group flex items-center justify-center space-x-sm px-[32px] py-margin-mobile w-full sm:w-auto h-auto"
              >
                <span>Go Home</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">home</span>
              </Button>
              <Button
                variant="heroOutline"
                onClick={() => navigate('/shop')}
                className="group flex items-center justify-center space-x-sm px-[32px] py-margin-mobile w-full sm:w-auto h-auto hover:bg-surface-variant"
              >
                <span>Continue Shopping</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
              </Button>
            </div>

            <div className="pt-lg w-full flex flex-col items-center lg:items-start gap-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Popular Categories
              </span>
              <div className="flex flex-wrap gap-xs justify-center lg:justify-start">
                <Link to="/category/fashion" className="px-sm py-xs bg-surface-container-low rounded-full font-label-sm text-label-sm text-on-surface hover:bg-primary-container hover:text-on-primary cursor-pointer transition-colors">
                  Fashion
                </Link>
                <Link to="/category/electronics" className="px-sm py-xs bg-surface-container-low rounded-full font-label-sm text-label-sm text-on-surface hover:bg-primary-container hover:text-on-primary cursor-pointer transition-colors">
                  Electronics
                </Link>
                <Link to="/category/home" className="px-sm py-xs bg-surface-container-low rounded-full font-label-sm text-label-sm text-on-surface hover:bg-primary-container hover:text-on-primary cursor-pointer transition-colors">
                  Home
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
