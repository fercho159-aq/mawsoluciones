import ContactForm from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Megaphone } from "lucide-react";
import WhatsappIcon from "@/components/icons/whatsapp-icon";
import AnimatedDiv from "@/components/animated-div";
import AnimatedChatInvitation from "@/components/animated-chat-invitation";

const ContactPage = () => {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold flex items-center justify-center gap-4">
             Hablemos
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/80">
            ¿Listo para llevar tu marca al siguiente nivel? Contáctanos o reserva una sesión estratégica.
          </p>
        </AnimatedDiv>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatedDiv className="bg-card p-8 rounded-lg shadow-lg" transition={{ delay: 0.2 }}>
            <h3 className="font-headline text-2xl font-bold mb-6">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:hola@mawsoluciones.com" className="hover:text-primary transition-colors">hola@mawsoluciones.com</a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+123456789" className="hover:text-primary transition-colors">+1 (234) 567-89</a>
              </div>
            </div>
            <div className="my-8">
              <h3 className="font-headline text-2xl font-bold mt-10 mb-4">O contáctanos por WhatsApp</h3>
              <Button asChild className="w-full" size="lg" variant="whatsapp">
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="w-6 h-6 mr-2" />
                  Enviar Mensaje
                </a>
              </Button>
            </div>
            <AnimatedChatInvitation />
          </AnimatedDiv>
          <AnimatedDiv id="booking" className="bg-card p-8 rounded-lg shadow-lg" transition={{ delay: 0.4 }}>
            <h3 className="font-headline text-2xl font-bold mb-6">Envíanos un mensaje</h3>
            <ContactForm />
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
