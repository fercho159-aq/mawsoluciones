
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
            <p className="mt-4 text-foreground/70 max-w-xs">
              Transformando ideas en resultados digitales.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-semibold text-lg mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li><Link href="/servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="/portafolio" className="hover:text-primary transition-colors">Nuestros clientes</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">Nosotros</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
