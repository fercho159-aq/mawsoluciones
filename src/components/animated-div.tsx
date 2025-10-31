// Inspired by https://www.frontend.fyi/v/framer-motion-animating-list-items

"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  variants?: Variants;
  initial?: string;
  whileInView?: string;
  viewport?: {
    once?: boolean;
    margin?: string;
  };
  transition?: object;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AnimatedDiv: React.FC<AnimatedDivProps> = ({
  children,
  className,
  variants = defaultVariants,
  initial = "hidden",
  whileInView = "visible",
  viewport = { once: true, margin: "0px 0px -50px 0px" },
  transition = { duration: 0.5, ease: "easeInOut" },
  ...props
}) => {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDiv;
