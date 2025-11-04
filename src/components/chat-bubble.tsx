"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const chatUrl = "https://n8n.srv1077453.hstgr.cloud/webhook/e0612a32-9846-4eba-9fdb-492ea557dd16/chat";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-[calc(4rem+1.5rem)] right-6 z-50 w-[calc(100vw-3rem)] h-[70vh] max-w-sm max-h-[700px] bg-card border rounded-xl shadow-2xl flex flex-col"
          >
            <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-headline text-lg">Asistente Virtual</h3>
                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                    <X className="w-5 h-5"/>
                </Button>
            </div>
            <iframe
              src={chatUrl}
              className="flex-grow w-full h-full border-0 rounded-b-xl"
              title="Chat con asistente virtual"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open chat bubble"
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl"
          size="icon"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
};

export default ChatBubble;
