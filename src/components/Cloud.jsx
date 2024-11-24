import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SkyScene from './SkyScene';

gsap.registerPlugin(ScrollTrigger);

const Cloud = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current || !textContainerRef.current) return;

    // Animation initiale
    gsap.set(videoRef.current, {
      scale: 0.3,
    });

    // Animation principale avec la vidéo
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: '+=70%',
        scrub: 1,

        onEnter: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 0.5
          });
        },
      
        
      }
    });

    // Animation de la vidéo
    mainTl.to(videoRef.current, {
      scale: 1.9,
      duration: 1,
      ease: 'none',
    });

    // Configuration commune du ScrollTrigger pour tous les éléments
    const commonScrollTrigger = {
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      toggleActions: 'play reverse play reverse',
      scrub: 1,
      onEnter: () => {
        gsap.to(textContainerRef.current, {
          opacity: 1,
          duration: 0.5
        });
      },
      onLeave: () => {
        gsap.to(textContainerRef.current, {
          opacity: 0,
          duration: 0.5
        });
      },
      onEnterBack: () => {
        gsap.to(textContainerRef.current, {
          opacity: 1,
          duration: 0.5
        });
      },
      onLeaveBack: () => {
        gsap.to(textContainerRef.current, {
          opacity: 0,
          duration: 0.5
        });
      }
    };

    gsap.fromTo(['.title'],
      { 
        opacity: 0,
        x: -100
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          ...commonScrollTrigger,
          scrub: 1
        }
      }
    );

    gsap.fromTo(['.separator', '.button-separator'],
      { 
        opacity: 0,
        x: 100
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          ...commonScrollTrigger,
          scrub: 1
        }
      }
    );

    gsap.fromTo(['.main-text'],
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
          ...commonScrollTrigger,
          scrub: 1
        }
      }
    );

    gsap.fromTo(['.description'],
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
          ...commonScrollTrigger,
          scrub: 1
        }
      }
    );

    gsap.fromTo('.cta-button',
      { 
        opacity: 0,
        y: 20 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1,
        scrollTrigger: {
          ...commonScrollTrigger,
          scrub: 1
        }
      }
    );

    return () => {
      mainTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-[180vh] w-full bg-transparent relative font-['RedBull'] z-100 fixed "
      style={{ opacity: 0 }}
    >
      {/* Conteneur pour les textes */}
      <div ref={textContainerRef} className="fixed w-full h-full z-[2]">
        {/* Titre en haut à gauche */}
        <div className="fixed top-40 left-[17%]">
          <h1 className="text-4xl text-white title font-demibold tracking-[0.03em]">
            Cloud <span className="text-[#FFD300] font-bold font-['RedBull2']">Citrus</span>
          </h1>
        </div>

        {/* Textes à droite */}
        <div className="fixed right-24 top-[40%] z-20 flex flex-col gap-8 max-w-md">
          <p 
            className="text-white text-xl main-text mb-8 transition-transform duration-300"
            onMouseEnter={() => {
              gsap.to('.main-text', { scale: 1.15, duration: 0.2 });
              gsap.to('.description', { scale: 0.9, duration: 0.2 });
            }}
            onMouseLeave={() => {
              gsap.to('.main-text', { scale: 1, duration: 0.2 });
              gsap.to('.description', { scale: 1, duration: 0.2 });
            }}
          >
            La légèreté et la <span className="text-[#FFD300]">fraîcheur</span> d’un ciel clair au zénith
          </p>

          <div className="w-[600px] h-[2px] bg-white separator"></div>

          <p 
            className="text-white description text-xl mt-4 transition-transform duration-300"
            onMouseEnter={() => {
              gsap.to('.description', { scale: 1.15, duration: 0.2 });
              gsap.to('.main-text', { scale: 0.9, duration: 0.2 });
            }}
            onMouseLeave={() => {
              gsap.to('.description', { scale: 1, duration: 0.2 });
              gsap.to('.main-text', { scale: 1, duration: 0.2 });
            }}
          >
            Agrumes doux <span className="text-[#FFD300]">(yuzu, citron vert)</span> combinés à une touche de <span className="text-[#FFD300]">menthe givrée</span>
          </p>

          {/* Conteneur pour le bouton et le trait */}
          <div className="flex items-center justify-between pt-12">
            <button className="text-white/70 text-left hover:text-white border border-white/30 hover:border-white/70 bg-transparent px-6 py-3 transition-all duration-300 cta-button rounded-lg cursor-pointer w-fit">
              En savoir plus
            </button>
            <div className="h-[2px] bg-white button-separator w-[207px]"></div>
          </div>
        </div>
      </div>

      {/* Conteneur vidéo et canette */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div 
          ref={videoRef} 
          className="w-full h-full max-w-[80vw] max-h-[80vh] relative"
        >
          {/* Ajout du filtre noir */}
       
          <video 
            className="w-full h-full object-cover rounded-lg"
            autoPlay 
            muted 
            loop
            playsInline
            style={{ filter: 'brightness(0.66)' }}
          >
            <source src="assets/cloud.mp4" type="video/mp4" />
          </video>
        </div>
        <div 
          className="absolute inset-0 z-50" 
          style={{ 
            height: '100vh',
            width: '100vw',
            pointerEvents: 'auto'
          }}
        >
          <SkyScene />
        </div>
      </div>
    </div>
  );
};

export default Cloud;