import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import KarmineScene from './KarmineScene';

gsap.registerPlugin(ScrollTrigger);

const Karmine = () => {
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
        }
      }
    });

    // Animation de la vidéo
    mainTl.to(videoRef.current, {
      scale: 1.9,
      duration: 1,
      ease: 'none',
    });

    // Timeline pour les textes
    const textsTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top+=40% center',
        end: '+=80%',
        scrub: 1,
      }
    });

    textsTl
      .fromTo('.title',
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0 },
        '+=0.5'
      )
      .fromTo(['.separator', '.button-separator'],
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0 },
        '<+=0.1'
      )
      .fromTo('.main-text',
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0 },
        '<+=0.1'
      )
      .fromTo('.description',
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0 },
        '<+=0.1'
      )
      .fromTo('.cta-button',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0 },
        '<+=0.1'
      );

    // Ajout du ScrollTrigger pour gérer la visibilité des textes
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        gsap.to(textContainerRef.current, { visibility: 'visible', duration: 0 });
      },
      onLeave: () => {
        gsap.to(textContainerRef.current, { visibility: 'hidden', duration: 0 });
      },
      onEnterBack: () => {
        gsap.to(textContainerRef.current, { visibility: 'visible', duration: 0 });
      },
      onLeaveBack: () => {
        gsap.to(textContainerRef.current, { visibility: 'hidden', duration: 0 });
      }
    });

    return () => {
      mainTl.kill();
      textsTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-[180vh] w-full bg-transparent relative font-redbull2 z-100 fixed"
      style={{ opacity: 0 }}
    >
      {/* Conteneur pour les textes */}
      <div ref={textContainerRef} className="fixed w-full h-full z-[2]">
        {/* Titre en haut à gauche */}
        <div className="fixed top-40 left-[17%]">
          <h1 className="text-4xl text-white title font-demibold tracking-[0.03em]">
            Karmine <span className="text-[#0094FF] font-bold">Energy</span>
          </h1>
        </div>

        {/* Textes à droite */}
        <div className="fixed right-24 top-[50%] z-20 flex flex-col gap-8 max-w-md">
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
            L'énergie pure de la <span className="text-[#0094FF]">compétition</span> dans une canette explosive
          </p>

          <div className="w-full h-[2px] bg-white separator"></div>

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
            Un boost <span className="text-[#0094FF]">électrisant</span> avec des notes de fruits du dragon et une touche de <span className="text-[#0094FF]">plasma glacé</span>
          </p>

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
          <video 
            className="w-full h-full object-cover rounded-lg"
            autoPlay 
            muted 
            loop
            playsInline
          >
            <source src="assets/karmine.mp4" type="video/mp4" />
          </video>
        </div>
        <div 
          className="absolute inset-0 z-100" 
          style={{ 
            height: '100vh',
            width: '100vw',
            pointerEvents: 'auto'
          }}
        >
          <KarmineScene />
        </div>
      </div>
    </div>
  );
};

export default Karmine; 