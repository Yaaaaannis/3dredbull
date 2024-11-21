import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const Scene3D = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    // Initialisation de Lenis
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Configuration de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Chargement du modèle GLB
    const loader = new GLTFLoader();
    loader.load('/assets/redbull.glb', (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      scene.add(model);
      
      // Position initiale du modèle
      model.position.set(0, 0, 4.3);
      model.scale.set(1, 1, 1);
      // Rotation initiale (180 degrés = Math.PI)
      model.rotation.y = Math.PI;

      // Animation avec GSAP et ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.second-section',
          start: 'top top',
          end: `+=${window.innerHeight * 2}`,
          scrub: true,
          onEnter: () => {
            gsap.to(containerRef.current, {
              opacity: 1,
              duration: 0.5
            });
          },
          onLeaveBack: () => {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.5
            });
          }
        }
      });

      // Animation combinée : position et rotation
      tl.to(model.position, {
        z: 4.83,
        y: -0.09,
        duration: 1,
        ease: "power2.inOut"
      })
      .to(model.rotation, {
        y: 0, // Retour à 0 = rotation de 180 degrés
        duration: 1,
        ease: "power2.inOut"
      }, "<"); // Le "<" fait démarrer cette animation en même temps que la précédente
    });

    // Éclairage
    // Lumière ambiante réduite pour plus de contraste
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Première lumière directionnelle (côté gauche)
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(-150, 1, 4.83); // Position à gauche et légèrement en avant
    scene.add(directionalLight1);

    // Deuxième lumière directionnelle (côté droit)


    // Optionnel : Ajout d'une lumière de remplissage douce depuis l'arrière
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-4, 3, 8);
    scene.add(backLight);

    // Optionnel : Helpers pour visualiser les lumières pendant le développement
 


    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        style={{ filter: 'brightness(0.6)' }} // Optionnel: assombrit légèrement la vidéo
      >
        <source src="/assets/planete.mp4" type="video/mp4" />
      </video>

      <div ref={containerRef} style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        opacity: 0,
      }}>
      </div>
      <div className="second-section" style={{ height: '200vh' }}></div>
    </>
  );
};

export default Scene3D;
