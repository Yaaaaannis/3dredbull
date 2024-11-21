import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const Scene3D = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const textContainerRef = useRef(null);

  // Déplacer les fonctions en dehors du useEffect
  const scrollDown = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: `+=${window.innerHeight}`,
      ease: "power2.inOut"
    });
  };

  const scrollUp = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: `-=${window.innerHeight}`,
      ease: "power2.inOut"
    });
  };

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
      model.rotation.y = Math.PI;

      // Animation légère de rotation
      gsap.to(model.rotation, {
        x: '+=0.05',
        z: '+=0.05',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

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

      // Animation de flottement
      const floatingTl = gsap.timeline({
        repeat: -1,
        yoyo: true
      });
      
      floatingTl.to(model.position, {
        y: '-=0.01',
        duration: 2,
        ease: "power1.inOut"
      });

      // Animation combinée : position et rotation
      tl.to(model.position, {
        z: 4.83,
        y: -0.09,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          // Mettre à jour la base de l'animation de flottement
          floatingTl.invalidate().restart();
        }
      })
      .to(model.rotation, {
        y: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "<");
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

    // Animation des textes avec ScrollTrigger
    const title = textContainerRef.current.querySelector('.title');
    const mainText = textContainerRef.current.querySelector('.main-text');
    const separator = textContainerRef.current.querySelector('.separator');
    const description = textContainerRef.current.querySelector('.description');
    const button = textContainerRef.current.querySelector('.cta-button');
    const buttonSeparator = textContainerRef.current.querySelector('.button-separator');

    gsap.fromTo([title],
      { 
        opacity: 0,
        x: -100
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
          
        }
      }
    );
    gsap.fromTo([separator, buttonSeparator],
      { 
        opacity: 0,
        x: 100
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        }
      }
    );
    gsap.fromTo([mainText],
      { 
        opacity: 0,
        x: 100
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.4,
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        }
      }
    );
    gsap.fromTo([description,],
      { 
        opacity: 0,
        x: 100
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        delay: 0.4,
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        }
      }
    );
    gsap.fromTo(button,
      { 
        opacity: 0,
        y: 20 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1, // Délai plus long pour le bouton
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
        }
      }
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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

      {/* Conteneur pour tous les textes */}
      <div ref={textContainerRef} className="fixed w-full h-full z-[2] ">
        {/* Titre en haut à gauche */}
        <div className="fixed top-40 left-[20%]  ">
          <h1 className="text-5xl text-white title font-demibold">
            Cosmic <span className="text-[#4C4A90]">Berry</span>
          </h1>
        </div>

        {/* Textes à droite */}
        <div className="fixed right-24 top-[50%] z-20 flex flex-col gap-8 max-w-md">
          <p 
            className="text-white text-xl main-text mb-8  transition-transform duration-300"
            onMouseEnter={() => {
              gsap.to('.main-text', { scale: 1.15, duration: 0.2 });
              gsap.to('.description', { scale: 0.9, duration: 0.2 });
            }}
            onMouseLeave={() => {
              gsap.to('.main-text', { scale: 1, duration: 0.2 });
              gsap.to('.description', { scale: 1, duration: 0.2 });
            }}
          >
            Un délicieux mélange avec des fruits 
            <span className="text-[#4C4A90]"> mystérieux </span> 
            de galaxies lointaines
          </p>

          <div className="w-full h-[2px] bg-white separator"></div>

          <p 
            className="text-white description text-xl mt-4  transition-transform duration-300"
            onMouseEnter={() => {
              gsap.to('.description', { scale: 1.15, duration: 0.2 });
              gsap.to('.main-text', { scale: 0.9, duration: 0.2 });
            }}
            onMouseLeave={() => {
              gsap.to('.description', { scale: 1, duration: 0.2 });
              gsap.to('.main-text', { scale: 1, duration: 0.2 });
            }}
          >
            Mélange de <span className="text-[#4C4A90]">myrtille</span>, 
            <span className="text-[#4C4A90]"> mûre </span> 
            et <span className="text-[#4C4A90]">grenade</span> avec une pointe pétillante évoquant l'infini
          </p>

          {/* Conteneur pour le bouton et le trait */}
          <div className="flex items-center justify-between pt-12">
            <button className="text-white/70 text-left hover:text-white border border-white/30 hover:border-white/70 bg-transparent px-6 py-3 transition-all duration-300 cta-button rounded-lg cursor-pointer w-fit ">
              En savoir plus
            </button>
            <div className="h-[2px] bg-white button-separator w-[207px]"></div>
          </div>
        </div>
      </div>

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

      {/* Navigation Arrows */}
      <div className="fixed bottom-12 left-20 z-30 flex flex-col gap-4">
        <button 
          onClick={scrollUp}
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:border-white/70 transition-all duration-300"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="rotate-180"
          >
            <path 
              d="M12 5V19M12 19L19 12M12 19L5 12" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button 
          onClick={scrollDown}
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:border-white/70 transition-all duration-300"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M12 5V19M12 19L19 12M12 19L5 12" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Scene3D;
