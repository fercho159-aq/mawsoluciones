"use client";

import AnimatedDiv from '@/components/animated-div';
import TypewriterTitle from '@/components/typewriter-title';
import { Suspense } from 'react';
import BlogPageContent from './blog-page-content';

export default function BlogPage() {
  return (
    <div className="bg-background">
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv className="max-w-3xl mx-auto">
            <TypewriterTitle text="Nuestro Blog" />
          </AnimatedDiv>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
            <Suspense fallback={<div>Cargando...</div>}>
                <BlogPageContent />
            </Suspense>
        </div>
      </section>
    </div>
  );
}
