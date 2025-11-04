import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import ChatBubble from '@/components/chat-bubble';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'MAW Soluciones | Agencia de Marketing Digital',
  description: 'Potenciamos tu marca con estrategias de marketing digital innovadoras. Creación de contenido, desarrollo web, y más.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
          {children}
          <ChatBubble />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
