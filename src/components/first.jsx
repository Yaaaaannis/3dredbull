import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function First() {
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const loremTextRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
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
    <section className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden font-['RedBull']">
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
        <p ref={loremTextRef} className="text-white text-center max-w-xl text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ex vel tellus placerat laoreet
        </p>
        
        {/* Bouton */}
        <button 
          ref={buttonRef}
          className="mt-8 py-4 px-10 bg-white text-black rounded-xl hover:bg-opacity-90 transition-all font-black text-xl tracking-wider"
        >
          Explore
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