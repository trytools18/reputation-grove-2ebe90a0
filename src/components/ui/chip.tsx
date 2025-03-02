
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        accent: 
          "bg-accent text-accent-foreground hover:bg-accent/80",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  asChild?: boolean
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(chipVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Chip.displayName = "Chip"

export { Chip, chipVariants }
