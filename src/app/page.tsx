import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { ClientRuntime } from "@/components/layout/ClientRuntime";
import { Cursor } from "@/components/ui/Cursor";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Philosophy } from "@/components/sections/Philosophy";
import { Contact } from "@/components/sections/Contact";
import { isContactBackendConfigured } from "@/lib/site";

export default function Home() {
  return (
    <>
      <ClientRuntime />
      <Loader />
      <Cursor />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Experience />
        <Expertise />
        <Projects />
        <Certifications />
        <Philosophy />
        <Contact backendEnabled={isContactBackendConfigured()} />
      </main>
      <Footer />
    </>
  );
}
