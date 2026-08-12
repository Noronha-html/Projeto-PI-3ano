import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutProject from "./components/AboutProject";
import HowItWorks from "./components/HowItWorks";
import RealtimeDashboard from "./components/RealtimeDashboard";
import HardwareCard from "./components/HardwareCard";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SectionTitle from "./components/SectionTitle";
import { hardwareItems } from "./data/projectData";

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main>
        <Hero />

        <AboutProject />

        <HowItWorks />

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionTitle
              eyebrow="Hardware"
              title="Os componentes que tornam tudo possível."
              description="O sistema combina componentes físicos e software para realizar a coleta e o processamento das informações."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {hardwareItems.map((item) => (
                <HardwareCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <RealtimeDashboard />

        <Team />

        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;