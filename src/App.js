import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import './App.css';
import Scene3D from './components/scene';
import First from './components/first';
import Cloud from './components/Cloud';
import Karmine from './components/Karmine';

import './index.css';

function App() {
  // Configuration de Lenis avec des paramètres plus smooth
  const lenisOptions = {
    duration: 1.4, // Augmenté de 1.2 à 2.4 pour un scroll plus long
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing personnalisé
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8, // Réduit de 1 à 0.8 pour plus de smoothness
    smoothTouch: true, // Activé pour les appareils tactiles
    touchMultiplier: 1.5, // Réduit pour plus de contrôle
    infinite: false,
    lerp: 0.1, // Ajout d'un lerp pour un effet plus smooth
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <main className="relative">
        <First />
        <Scene3D />
        <div className="relative">
          <section className="relative w-screen cloud-section">
            <Cloud />
          </section>
          <section className="relative w-screen karmine-section">
            <Karmine />
          </section>
        </div>
      </main>
    </ReactLenis>
  );
}

export default App;
