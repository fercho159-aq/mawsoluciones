
import Header from "@/components/header";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/testimonials";
import BlogSection from "@/components/sections/blog";
import Footer from "@/components/footer";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <BlogSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
