import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const SkyScene = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Chargement de la canette
    const loader = new GLTFLoader();
    loader.load('/assets/redbull.glb', (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      scene.add(model);
      
      // Position initiale du modèle (plus haute mais même Z)
      model.position.set(0, 2, 4.3);
      model.scale.set(1, 1, 1);
      model.rotation.set(0, Math.PI, -0.5);

      // Animation de base
      animationRef.current = gsap.to(model.rotation, {
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
          trigger: containerRef.current,
          start: 'top+=20% center',
          end: '+=80%',
          scrub: 1,
          onEnter: () => {
            gsap.to(containerRef.current, {
              opacity: 1,
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
        duration: 2.5,
        ease: "sine.inOut"
      });

      // Animation combinée : position et rotation
      tl.to(model.position, {
        z: 4.83,
        y: -0.09,
        x: -0.05,
        duration: 3,
        ease: "power3.inOut",
        onUpdate: () => {
          // Mettre à jour la base de l'animation de flottement
          floatingTl.invalidate().restart();
        }
      })
      .to(model.rotation, {
        y: 0,
        duration: 2,
        ease: "power3.inOut"
      }, "<");

      const handleMouseEnter = () => {
        // Pause l'animation de base
        animationRef.current.pause();
        
        gsap.to(model.rotation, {
          x: model.rotation.x + 0.3,
          z: model.rotation.z + 0.3,
          duration: 0.5,
          ease: "power2.out"
        });
        gsap.to(model.scale, {
          x: 1.15,
          y: 1.15,
          z: 1.15,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
      };

      const handleMouseLeave = () => {
        // Reprend l'animation de base
        animationRef.current.resume();
        
        gsap.to(model.rotation, {
          x: model.rotation.x,
          z: model.rotation.z,
          duration: 0.5,
          ease: "power2.inOut"
        });
        gsap.to(model.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
      };

      // Ajout des événements avec capture
      containerRef.current.addEventListener('mouseenter', handleMouseEnter, true);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave, true);

      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mouseenter', handleMouseEnter, true);
          containerRef.current.removeEventListener('mouseleave', handleMouseLeave, true);
        }
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="can-reveal"
      style={{ 
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        cursor: 'pointer',
        pointerEvents: 'auto',
        touchAction: 'none'
      }}
    />
  );
};

export default SkyScene;