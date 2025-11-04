"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const chatVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const AnimatedChatInvitation = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.8,
            repeat: Infinity,
            repeatDelay: 2,
          },
        },
      }}
      className="mt-10 mb-4 text-center"
    >
      <h3 className="font-headline text-2xl font-bold mb-6">
        Desafía a nuestro Asistente Virtual
      </h3>

      <div className="flex flex-col items-center gap-4 min-h-[160px]">
        <motion.div
          key="msg1"
          variants={chatVariants}
          className="bg-secondary text-secondary-foreground p-3 rounded-lg rounded-bl-none max-w-xs self-start shadow-md"
        >
          <p>Hola, quiero más informes</p>
        </motion.div>

        <motion.div
          key="msg2"
          variants={chatVariants}
          className="bg-primary text-primary-foreground p-3 rounded-lg rounded-br-none max-w-xs self-end shadow-md"
        >
          <p>Hola, soy el asistente virtual de MAW Soluciones. ¿Cómo te puedo ayudar?</p>
        </motion.div>

        <motion.div
          key="button"
          variants={chatVariants}
          className="w-full"
        >
          <Button
            onClick={() => {
              // This is a bit of a hack, but it's the easiest way to trigger the bubble
              const chatBubbleButton = document.querySelector('[aria-label="Open chat bubble"]') as HTMLElement;
              if (chatBubbleButton) {
                chatBubbleButton.click();
              }
            }}
            className="w-full"
            size="lg"
          >
            Hablar con el Asistente
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedChatInvitation;
