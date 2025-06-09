import Header from "@/components/header";
import About from "@/components/home/about";
import Casestudy from "@/components/home/case-study";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <div className="p-2">
      <Hero />
      <About />
      <Casestudy />
      <Footer />
    </div>
  );
}
