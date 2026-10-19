import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutProject from "./components/AboutProject";
import HowItWorks from "./components/HowItWorks";
import RealtimeDashboard from "./components/RealtimeDashboard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#fffef1] text-[#111122]">
      {/* Cabeçalho */}
      <Header />

      <main>
        {/* Apresentação principal */}
        <Hero />

        {/* Sobre o projeto */}
        <AboutProject />

        {/* Como funciona */}
        <HowItWorks />

        {/* Dashboard de dados */}
        <RealtimeDashboard />

        {/* Contato */}
        <Contact />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default App;