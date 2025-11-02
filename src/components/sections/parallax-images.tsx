"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxImages = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const laptopX = useTransform(scrollYProgress, [0, 0.4, 0.6], ['0vw', '0vw', '0vw']);
  const laptopScale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.8, 1, 1]);
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.35, 0.4], [0, 1, 1]);
  
  const phoneLeftX = useTransform(scrollYProgress, [0, 0.4, 0.6], ['-35vw', '-15vw', '0vw']);
  const phoneLeftY = useTransform(scrollYProgress, [0, 0.4, 0.6], ['10vh', '0vh', '0vh']);
  const phoneLeftRotate = useTransform(scrollYProgress, [0, 0.4, 0.6], [-20, -10, 0]);
  const phoneLeftScale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.5, 0.6, 1]);
  const phoneLeftOpacity = useTransform(scrollYProgress, [0, 0.38, 0.45], [0, 1, 1]);

  const phoneRightX = useTransform(scrollYProgress, [0, 0.4, 0.6], ['35vw', '15vw', '0vw']);
  const phoneRightY = useTransform(scrollYProgress, [0, 0.4, 0.6], ['20vh', '5vh', '0vh']);
  const phoneRightRotate = useTransform(scrollYProgress, [0, 0.4, 0.6], [20, 10, 0]);
  const phoneRightScale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.5, 0.6, 1]);
  const phoneRightOpacity = useTransform(scrollYProgress, [0, 0.38, 0.45], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
            className="absolute w-[60vw] h-[60vh] max-w-[800px] max-h-[500px]"
            style={{
                x: laptopX,
                scale: laptopScale,
                opacity: laptopOpacity,
                zIndex: 10
            }}
        >
          <Image
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3NjIwOTM0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Laptop"
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.div 
            className="absolute w-[25vw] h-[50vh] max-w-[250px] max-h-[500px]"
             style={{
                x: phoneLeftX,
                y: phoneLeftY,
                rotate: phoneLeftRotate,
                scale: phoneLeftScale,
                opacity: phoneLeftOpacity,
                zIndex: 20
            }}
        >
          <Image
             src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3ZWIlMjBkZXNpZ258ZW58MHx8fHwxNzYyODU2NzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Phone Left"
            fill
            className="object-contain"
          />
        </motion.div>
         <motion.div 
            className="absolute w-[20vw] h-[40vh] max-w-[200px] max-h-[400px]"
            style={{
                x: phoneRightX,
                y: phoneRightY,
                rotate: phoneRightRotate,
                scale: phoneRightScale,
                opacity: phoneRightOpacity,
                zIndex: 20
            }}
        >
          <Image
             src="https://images.unsplash.com/photo-1559028006-448665bd7c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3ZWIlMjBkZXNpZ258ZW58MHx8fHwxNzYyODU2NzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Phone Right"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxImages;
