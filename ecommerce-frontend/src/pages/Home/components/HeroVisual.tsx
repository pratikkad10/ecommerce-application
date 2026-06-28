import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/image";

export function HeroVisual() {
  return (
    <div className="relative h-[500px] lg:h-[600px] hidden md:block">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-4 p-4">
        {/* Main Image */}
        <div className="col-span-8 row-span-6 rounded-2xl overflow-hidden ambient-shadow hover-lift relative group">
          <Img
            variant="hero"
            alt="A high-end fashion editorial shot of a woman in a vibrant orange coat against a minimalist studio background."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT-eB6HQXmEP-hv2s9LHZ0OYvSC71Prh7kUsT3jTBZMnKNDiHWDFc2nxhNeQs2yQ7PwQkUPe8u_Z64NL8lbwM7523WqLS7VaLbvEwSisBbuNQYJNq1861u2buMpLz_B7Z-HEdAL-yOkBwGCOMpzOJCnBXNda9NEyUm5JFt645aERLBr1xOwAgkWcliDLw7NyVizOLfnxQnSaBjDjQ885C1MQRFpdfcs3njbOrBCKuq--qgkPdzVg9joSvbckxk5YVfv3Q077r7jwZI"
          />
          <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-lg">
            <p className="text-label-sm font-bold text-on-surface">
              Autumn Collection
            </p>
          </div>
        </div>
        {/* Secondary Image Top */}
        <div className="col-span-4 row-span-3 rounded-2xl overflow-hidden ambient-shadow hover-lift relative group">
          <Img
            variant="hero"
            alt="A sleek, modern wireless headphone resting on a clean, geometric white pedestal."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWBodEU9cAKk2QW4AqnQarFH87FfWpG-H2Y0rRRc9FbSdxB629jWnI_MZhcyknK3lRuecYrMhel5dYGHVvMeGM_pqbmTUm9gfYqmD3kY65IADWV8LfQ6pVADwajCIIA1m1LX_Acz9AsOssYu2ulSls1VuY_V51NLN4xHIyCL35veg2juDL73ToGc1_f6c66yFN4Wcbfk9-4_F415nFEnr2qqfhdwkz52kYiBpZPwk0Q4uWFd4E7gg0gd1JXY4l-YygTm3LJzO92n2o"
          />
          <div className="absolute top-4 right-4 bg-surface rounded-full p-2 shadow-sm">
            <span className="material-symbols-outlined text-primary-container text-sm">
              headphones
            </span>
          </div>
        </div>
        {/* Tertiary Image Bottom */}
        <div className="col-span-4 row-span-3 rounded-2xl overflow-hidden ambient-shadow hover-lift relative group bg-surface-container-highest flex items-center justify-center">
          <Img
            variant="heroBlend"
            alt="A beautifully styled minimalist living room scene featuring a modern orange accent chair."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXrGrnF2eXyAjHdk4SSKKDb5_4v8pIWjKn6r86BwkM7PDyjV9zZQmraSvp8Eo6EoonX5p0t7-dv0IuNxEfDK7SjeVo7N34fBcHG1-q06uaCwGf9u3NzSJkFNSM4hiNH6qugJCW9k_czxndugeS33NfK6jy7DzB_r8z0tkX6RjepmjGKIf0IbIdsEVoDqxENEmDqS_4aba_Mke1pv57-UfoZl2WcqcMBGYpsT3JmaTIoxD1elUWM0CevrQTSj1a-Ret6NIl_Qef7hYJ"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button variant="heroIcon" size="heroIcon">
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
