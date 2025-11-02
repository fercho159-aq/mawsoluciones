import Header from "@/components/header";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Portfolio from "@/components/sections/portfolio";
import About from "@/components/sections/about";
import Testimonials from "@/components/sections/testimonials";
import BlogSection from "@/components/sections/blog";
import Contact from "@/components/sections/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <BlogSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
