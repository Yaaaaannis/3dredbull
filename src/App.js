import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import './App.css';
import Scene3D from './components/scene';
import First from './components/first';
import Cloud from './components/Cloud';
import './index.css';

function App() {
  // Configuration de Lenis
  const lenisOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing personnalisé
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <main className="relative">
        <First />
        <Scene3D />
        <section className="h-[10vh] w-screen bg-transparent second-section"></section>
        <section className="relative w-screen cloud-section">
          <Cloud />
        </section>
      </main>
    </ReactLenis>
  );
}

export default App;
