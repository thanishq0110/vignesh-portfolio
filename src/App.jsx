import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import SmokeBackground from './components/SmokeBackground';
import WaveDivider from './components/WaveDivider';
import TubesCursorEffect from './components/TubesCursorEffect';
import Minimap from './components/Minimap';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useWorksScene from './hooks/useWorksScene';
import './index.css';

function App() {
  const inWorksScene = useWorksScene();

  return (
    <div className="app-container">
      <Preloader />
      <SmokeBackground smokeColor="#aaaaaa" />
      <TubesCursorEffect color="#ffffff" />
      <Minimap inWorksScene={inWorksScene} />
      <Navbar inWorksScene={inWorksScene} />
      <main>
        <Hero />
        <WaveDivider />
        <About />
        <Projects inWorksScene={inWorksScene} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
