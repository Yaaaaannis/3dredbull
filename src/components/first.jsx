import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function First() {
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const loremTextRef = useRef(null);
  const buttonRef = useRef(null);
  const navbarContainerRef = useRef(null);

  useEffect(() => {
    // Animation de la navbar
    ScrollTrigger.create({
      trigger: '.first-section',
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        gsap.to(navbarContainerRef.current, {
          yPercent: -100,
          duration: 0.5,
          ease: 'power2.inOut'
        });
      },
      onEnterBack: () => {
        gsap.to(navbarContainerRef.current, {
          yPercent: 0,
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    });

    // Animation des traits
    gsap.fromTo(leftLineRef.current,
      { width: 0 },
      { width: '14rem', duration: 1, ease: "power2.out" }
    );

    gsap.fromTo(rightLineRef.current,
      { width: 0 },
      { width: '14rem', duration: 1, ease: "power2.out" }
    );

    // Animation des textes, lorem ipsum et bouton avec délai
    gsap.fromTo(
      [leftTextRef.current, rightTextRef.current, loremTextRef.current, buttonRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: "power2.out", stagger: 0.1 }
    );
  }, []);

  return (
    <section className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden font-['RedBull'] first-section">
      {/* Navbar avec trait rouge */}
      <div ref={navbarContainerRef} className="fixed top-0 w-full z-50">
        <nav className="w-full px-16 pt-8 pb-4 flex justify-between items-center">
          {/* Bouton Menu à gauche */}
          <button className="text-white hover:text-red-600 transition-colors relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Bouton Recherche à droite */}
          <button className="text-white hover:text-red-600 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </nav>
        {/* Trait rouge sous la navbar */}
        <div className="w-full h-[2px] bg-[#B90E0A]"></div>
      </div>

      {/* Traits latéraux */}
      <div className="absolute left-0 top-[30%] flex flex-col items-end z-20">
        <div ref={leftLineRef} className="w-56 h-px bg-white"></div>
        <span ref={leftTextRef} className="text-white mt-4 text-right px-6">2024</span>
      </div>
      
      <div className="absolute right-0 top-[30%] flex flex-col items-start z-20">
        <div ref={rightLineRef} className="w-56 h-px bg-white"></div>
        <span ref={rightTextRef} className="text-white mt-4 px-6">Edition</span>
      </div>

      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/redbullvideo.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-red-900 opacity-80 z-1"></div>
      
      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center gap-8 pb-20">
        {/* Logo RedBull */}
        <div className="flex flex-col items-center gap-4">
          <img src="/assets/redbulls.png" alt="Red Bull Logo" className="w-96" />
        </div>
        
        {/* Texte */}
        <p ref={loremTextRef} className="text-white text-center max-w-[600px] text-3xl">
          Faites le plein d'énergie avec notre nouvelle gamme Red Bull : plus d'intensité, plus de possibilités, toujours plus loin
        </p>
        
        {/* Bouton */}
        <button 
          ref={buttonRef}
          className="mt-8 py-3 px-8 bg-[#B90E0A]/25 text-white rounded-lg hover:bg-[#B90E0A]/40 transition-all duration-300 font-redbull2 text-lg tracking-wide border border-white/10"
        >
          Découvrir
        </button>
      </div>
    </section>
  );
}

// Curseur avec un cercle qui pulse pour représenter l'énergie
const CustomCursor = () => {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    
    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      });
    };

    window.addEventListener('mousemove', moveCursor);
    
    // Animation de pulse continue
    gsap.to(cursor, {
      scale: 1.2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed w-6 h-6 rounded-full border-2 border-red-500 pointer-events-none z-50 mix-blend-difference"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
};