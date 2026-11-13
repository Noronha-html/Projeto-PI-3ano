import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutProject from "./components/AboutProject";
import HowItWorks from "./components/HowItWorks";
import RealtimeDashboard from "./components/RealtimeDashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#fffef1] text-[#111122]">
      <Header />

      <main>
        <Hero />

        <AboutProject />

        <HowItWorks />

        <RealtimeDashboard />
      </main>

      <Footer />
    </div>
  );
}

export default App;