import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  emoji,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : motion.button;

  const buttonContent = (
    <div>
      {emoji && <span className="text-xl mr-1">{emoji}</span>}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );

  const buttonProps = {
    "data-slot": "button",
    className: cn(
      buttonVariants({ variant, size, className }),
      "rounded-2xl shadow-genz font-heading px-6 py-3 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-98 flex items-center gap-2 text-lg",
      variant === "secondary" &&
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      variant === "outline" &&
        "bg-background text-foreground border-2 border-border hover:bg-accent hover:text-accent-foreground"
    ),
    ...props,
  };

  if (asChild) {
    return <Comp {...buttonProps}>{buttonContent}</Comp>;
  }

  return (
    <Comp
      {...buttonProps}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {buttonContent}
    </Comp>
  );
}

export { Button, buttonVariants };
