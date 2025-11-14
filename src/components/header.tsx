"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, CodeXml, PenSquare, Megaphone, Bot, Newspaper, Mic2, LayoutGrid, FileText, GraduationCap, Target, Wallet, BarChart4, DollarSign, Database, Users, Archive, Combine, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./logo";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ThemeToggle } from "./theme-toggle";

const servicesLinks = [
  { 
    href: "/servicios/desarrollo-web", 
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
   { 
    href: "/servicios/desarrollo-a-la-medida", 
    label: "Desarrollo a la Medida",
    description: "Creamos soluciones de software y aplicaciones personalizadas para resolver problemas específicos de tu negocio.",
    icon: <Combine className="w-5 h-5" />
  },
   { 
    href: "/servicios/automatizacion-y-desarrollo", 
    label: "Automatización + Desarrollo",
    description: "Conectamos tus sistemas y bases de datos para crear flujos de trabajo potentes y personalizados.",
    icon: <Zap className="w-5 h-5" />
  },
];

const blogLinks = [
  { 
    href: "/blog?tab=news", 
    label: "Noticias",
    description: "Análisis y guías sobre las últimas tendencias del marketing digital en México y el mundo.",
    icon: <Newspaper className="w-5 h-5" />
  },
  { 
    href: "/blog?tab=interviews", 
    label: "Entrevistas",
    description: "Conversaciones con líderes de opinión, emprendedores y creativos que están redefiniendo sus industrias.",
    icon: <Mic2 className="w-5 h-5" />
  },
];

const portfolioLinks = [
  { 
    href: "/portafolio?tab=websites", 
    label: "Sitios Web",
    description: "Explora los proyectos web que hemos construido para una diversidad de clientes e industrias.",
    icon: <LayoutGrid className="w-5 h-5" />
  },
  { 
    href: "/portafolio?tab=content", 
    label: "Contenido",
    description: "Descubre las campañas de contenido y estrategias de redes sociales que hemos creado.",
    icon: <FileText className="w-5 h-5" />
  },
];

const resourcesLinks = [
  { href: "/recursos/gracias-sitio-web", label: "Gracias Sitio Web", description: "Requisitos iniciales para tu nuevo sitio web.", icon: <CodeXml className="w-5 h-5" /> },
  { href: "/recursos/gracias-contenido", label: "Gracias Contenido", description: "Materiales necesarios para empezar con tu contenido.", icon: <PenSquare className="w-5 h-5" /> },
  { href: "/recursos/renovacion", label: "Renovación de Servicio", description: "Pasos a seguir para continuar nuestra colaboración.", icon: <Users className="w-5 h-5" /> },
  { href: "/recursos/correo", label: "Configuración de Correo", description: "Guía para configurar tu correo corporativo.", icon: <Megaphone className="w-5 h-5" /> },
];

const coursesLinks = [
  {
    href: "/cursos/facebook-ads",
    label: "Facebook Ads para Principiantes",
    description: "Aprende desde cero a crear campañas efectivas y a optimizar tu presupuesto en la plataforma de Meta.",
    icon: <Megaphone className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-1')
  },
  {
    href: "/cursos/google-ads",
    label: "Google Ads Esencial",
    description: "Domina la red de búsqueda y Display para capturar clientes con alta intención de compra.",
    icon: <Target className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-2')
  },
  {
    href: "/cursos/tiktok-ads",
    label: "Publicidad en TikTok",
    description: "Descubre cómo crear anuncios virales y conectar con la Generación Z en la plataforma de video corto.",
    icon: <Wallet className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-3')
  },
  {
    href: "/cursos/n8n",
    label: "Automatización con n8n",
    description: "Aprende a automatizar flujos de trabajo complejos y a conectar tus aplicaciones sin escribir código.",
    icon: <Bot className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-4')
  },
  {
    href: "/cursos/ventas",
    label: "Técnicas de Venta Modernas",
    description: "Desde el Social Selling hasta el cierre, aprende las metodologías que funcionan en la era digital.",
    icon: <BarChart4 className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-5')
  },
  {
    href: "/cursos/finanzas-personales",
    label: "Finanzas Personales para Emprendedores",
    description: "Organiza tus finanzas, aprende a invertir y asegura la salud financiera de tu negocio y tu vida.",
    icon: <DollarSign className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-6')
  },
  {
    href: "/cursos/firebase-web",
    label: "Sitios Web con Firebase",
    description: "Construye aplicaciones web modernas y escalables con Firebase y Next.js.",
    icon: <Database className="w-5 h-5" />,
    image: PlaceHolderImages.find(p => p.id === 'user-photo-1')
  }
];


const navLinks = [
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
          : "bg-transparent"
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
              <NavigationMenuTrigger>Casos de Éxito</NavigationMenuTrigger>
              <NavigationMenuContent>
                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                  {portfolioLinks.map((link) => (
                    <ListItem
                      key={link.label}
                      title={link.label}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
              <NavigationMenuContent>
                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {coursesLinks.map((link) => (
                    <ListItem
                      key={link.label}
                      title={link.label}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
              <NavigationMenuContent>
                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                  {blogLinks.map((link) => (
                    <ListItem
                      key={link.label}
                      title={link.label}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Recursos para Clientes</NavigationMenuTrigger>
              <NavigationMenuContent>
                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                  {resourcesLinks.map((link) => (
                    <ListItem
                      key={link.label}
                      title={link.label}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link href={link.href} className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </Link>
                </NavigationMenuLink>
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
                <nav className="mt-8 flex-1 flex-col gap-2 overflow-y-auto">
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
                        Casos de Éxito
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col gap-4 pt-2">
                          {portfolioLinks.map((link) => (
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
                     <AccordionItem value="item-4" className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                        Cursos
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col gap-4 pt-2">
                          {coursesLinks.map((link) => (
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
                    <AccordionItem value="item-3" className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                        Blog
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col gap-4 pt-2">
                          {blogLinks.map((link) => (
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
                     <AccordionItem value="item-5" className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                        Recursos para Clientes
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <div className="flex flex-col gap-4 pt-2">
                          {resourcesLinks.map((link) => (
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
                  </Accordion>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-lg font-medium px-4 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/equipo"
                    className="block text-lg font-medium px-4 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Equipo
                  </Link>
                </nav>
                <div className="mt-auto pt-4">
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
