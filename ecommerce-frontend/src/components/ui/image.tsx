import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const imageVariants = cva(
  "object-cover",
  {
    variants: {
      variant: {
        default: "",
        hero: "w-full h-full transition-transform duration-700 group-hover:scale-105",
        heroBlend: "w-full h-full opacity-80 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ImgProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof imageVariants> {}

const Img = React.forwardRef<HTMLImageElement, ImgProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn(imageVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Img.displayName = "Img"

export { Img, imageVariants }
