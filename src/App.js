import './App.css';
import Scene3D from './components/scene';
import First from './components/first';

import './index.css';

function App() {
  return (
    <main className="relative">
      <First />
      
      <Scene3D />
      <div className="relative z-[1]">
        
        <section className="h-screen w-screen bg-transparent"></section>
        <section className="h-screen w-screen bg-black"></section>
      </div>
    </main>
  );
}

export default App;
