import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import gsap from 'gsap';
import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Synchroniser GSAP avec Lenis
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';

gsap.registerPlugin(ScrollTrigger);

// Créer une fonction pour synchroniser GSAP avec Lenis
function SmoothScrolling() {
  const lenis = useLenis(({ scroll }) => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });

    return () => {
      gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
      });
    };
  }, [lenis]);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SmoothScrolling />
    <App />
  </React.StrictMode>
);
