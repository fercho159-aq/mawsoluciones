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
  const phoneY = useTransform(scrollYProgress, [0.4, 0.7], ['20vh', '0vh']);

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
            className="absolute w-[60vw] h-[60vh] max-w-[800px] max-h-[500px]"
            style={{
                scale: laptopScale,
                opacity: laptopOpacity,
                y: laptopY,
                zIndex: 10
            }}
        >
          <Image
            src="https://images.unsplash.com/photo-1678690832311-bb6e361989ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwZGVzaWdufGVufDB8fHx8MTc2MTkzMTQwN3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Laptop"
            fill
            className="object-contain"
            data-ai-hint="website design"
          />
        </motion.div>
        
        <motion.div 
            className="absolute w-[25vw] h-[50vh] max-w-[250px] max-h-[500px]"
             style={{
                scale: phoneScale,
                opacity: phoneOpacity,
                y: phoneY,
                zIndex: 20
            }}
        >
          <Image
             src="https://images.unsplash.com/photo-1657812159075-7f0abd98f7b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxlY29tbWVyY2UlMjB3ZWJzaXRlfGVufDB8fHx8MTc2MTg5MTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
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
