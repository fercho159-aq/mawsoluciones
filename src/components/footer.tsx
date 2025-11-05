
import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "./logo";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <Logo />
          </div>
          <div>
            <h4 className="font-headline font-semibold text-lg mb-4 text-center">Nuestros Servicios</h4>
            <div className="grid grid-cols-2 gap-8">
                <ul className="space-y-2">
                    <li><Link href="/servicios/automatizacion" className="hover:text-primary transition-colors">Automatización</Link></li>
                    <li><Link href="/servicios/gestion-de-campanas" className="hover:text-primary transition-colors">Ads</Link></li>
                </ul>
                 <ul className="space-y-2">
                    <li><Link href="/servicios/desarrollo-web" className="hover:text-primary transition-colors">Sitios Web</Link></li>
                    <li><Link href="/servicios/creacion-de-contenido" className="hover:text-primary transition-colors">Contenido</Link></li>
                </ul>
            </div>
          </div>
          <div>
            <h4 className="font-headline font-semibold text-lg mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} MAW Soluciones. Todos los derechos reservados.</p>
          <div className="mt-4">
            <Button variant="link" asChild>
              <Link href="/equipo">admin interna</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
