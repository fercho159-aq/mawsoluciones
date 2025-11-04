
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, CodeXml, PenSquare, Megaphone, Bot } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./logo";
import { ThemeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const servicesLinks = [
  { 
    href: "/servicios/sitios-web", 
    label: "Sitios Web",
    description: "Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para la conversión.",
    icon: <CodeXml className="w-5 h-5" />
  },
  { 
    href: "/servicios/creacion-de-contenido", 
    label: "Contenido",
    description: "Creamos contenido atractivo y de alta calidad que resuena con tu audiencia y fortalece tu marca.",
    icon: <PenSquare className="w-5 h-5" />
  },
  { 
    href: "/servicios/gestion-de-campanas", 
    label: "Ads",
    description: "Planificamos, ejecutamos y medimos campañas publicitarias para maximizar tu retorno de inversión (ROI).",
    icon: <Megaphone className="w-5 h-5" />
  },
  { 
    href: "/servicios/automatizacion", 
    label: "Automatización",
    description: "Implementamos sistemas de automatización para nutrir leads y optimizar tus embudos de venta.",
    icon: <Bot className="w-5 h-5" />
  },
];

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300 ease-in-out",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/20 shadow-sm"
          : "bg-background"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {servicesLinks.map((service) => (
                    <ListItem
                      key={service.label}
                      title={service.label}
                      href={service.href}
                      icon={service.icon}
                    >
                      {service.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Nuestros clientes</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <ListItem
                    href="/portafolio"
                    title="Sitios Web"
                  >
                    Proyectos de desarrollo y diseño web.
                  </ListItem>
                  <ListItem
                    href="/portafolio" // TODO: Change to content portfolio page
                    title="Contenido"
                  >
                    Ejemplos de creación y estrategia de contenido.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/contacto">Reservar Sesión</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b pb-4">
                  <Logo />
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Cerrar menú</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="mt-8 flex flex-col gap-2">
                   <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                        Servicios
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col gap-4 pt-2">
                          {servicesLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-base font-medium text-foreground/80"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                        Nuestros clientes
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col gap-4 pt-2">
                          <Link href="/portafolio" className="text-base font-medium text-foreground/80" onClick={() => setIsMobileMenuOpen(false)}>
                            Sitios Web
                          </Link>
                          <Link href="/portafolio" className="text-base font-medium text-foreground/80" onClick={() => setIsMobileMenuOpen(false)}>
                            Contenido
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium px-4 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                  <Button asChild className="w-full">
                    <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)}>
                      Reservar Sesión
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
