import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutProject from "./components/AboutProject";
import HowItWorks from "./components/HowItWorks";
import RealtimeDashboard from "./components/RealtimeDashboard";
import Team from "./components/Team";
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

        {/* =================================================
            TESTE DA COMUNICAÇÃO COM O ARDUINO
            Por enquanto fica separado do dashboard.
            Depois vamos integrar diretamente nele.
           ================================================= */}
        

        {/* Equipe */}
        <Team />

        {/* Contato */}
        <Contact />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default App;
