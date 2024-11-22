import { ReactLenis } from '@studio-freight/react-lenis'
import './App.css';
import Scene3D from './components/scene';
import First from './components/first';
import Cloud from './components/Cloud';
import './index.css';

function App() {
  return (
    <ReactLenis root>
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
