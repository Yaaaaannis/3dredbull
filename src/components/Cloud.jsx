import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Cloud = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    // Animation initiale
    gsap.set(videoRef.current, {
      scale: 0.3,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: '+=80%',
        scrub: 1,
        markers: true, // Pour le debug, à retirer ensuite
        onEnter: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 0.5
          });
        },
      }
    });

    tl.to(videoRef.current, {
      scale: 1.9,
      duration: 1,
      ease: 'none',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen w-full bg-transparent flex items-center justify-center"
      style={{ opacity: 0 }} // Commence invisible
    >
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
          <source src="assets/cloud.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Cloud;