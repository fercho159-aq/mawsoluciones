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

  // Laptop Animation
  const laptopScale = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1]);
  const laptopOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const laptopY = useTransform(scrollYProgress, [0.3, 0.6], ['10vh', '0vh']);
  
  // Phone Animation
  const phoneScale = useTransform(scrollYProgress, [0.4, 0.7], [0.5, 1]);
  const phoneOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const phoneY = useTransform(scrollYProgress, [0.4, 0.7], ['0vh', '5vh']);
  const phoneX = useTransform(scrollYProgress, [0.4, 0.7], ['130vw', '-40vw']);


  return (
    <section ref={containerRef} className="relative h-[200vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
            className="absolute w-[100vw] h-[100vh] max-w-[1300px] max-h-[800px]"
            style={{
                scale: laptopScale,
                opacity: laptopOpacity,
                y: laptopY,
                zIndex: 10
            }}
        >
          <Image
            src="/images/desarrollo web/2.png"
            alt="Laptop"
            fill
            className="object-contain"
            data-ai-hint="website design"
          />
        </motion.div>
        
        <motion.div 
            className="absolute w-[100vw] h-[100vh] max-w-[600px] max-h-[1100px]"
             style={{
                scale: phoneScale,
                opacity: phoneOpacity,
                y: phoneY,
                x: phoneX,
                zIndex: 20
            }}
        >
          <Image
             src="/images/desarrollo web/4.png"
            alt="Phone"
            fill
            className="object-contain"
            data-ai-hint="ecommerce website"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxImages;
