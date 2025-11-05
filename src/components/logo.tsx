import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("text-2xl font-bold text-foreground", className)}>
      <Image src="/images/logo.png" alt="MAW Soluciones Logo" width={180} height={40} priority />
    </Link>
  );
};

export default Logo;
