import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("text-2xl font-bold text-foreground", className)}>
      MAW Soluciones
    </Link>
  );
};

export default Logo;
