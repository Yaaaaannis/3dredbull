import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const KarmineScene = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const spotlightRef = useRef(null);
  const spotlightRef2 = useRef(null);
  const floatingAnimationRef = useRef(null);
  const isHovered = useRef(false);

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

    // Éclairage de base encore plus réduit
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Spotlights bleus ajustés à la position finale de la canette
    const spotlight1 = new THREE.SpotLight(0x0066ff, 0);
    spotlight1.position.set(-1.5, 1, 4.83); // Aligné avec le Z final, légèrement décalé à gauche
    spotlight1.target.position.set(-0.05, -0.09, 4.83); // Pointe vers la position finale
    spotlight1.angle = Math.PI / 4;
    spotlight1.penumbra = 0.2;
    spotlight1.distance = 10;
    spotlightRef.current = spotlight1;
    scene.add(spotlight1);
    scene.add(spotlight1.target);

    const spotlight2 = new THREE.SpotLight(0x0066ff, 0);
    spotlight2.position.set(1.5, 1, 4.83); // Aligné avec le Z final, légèrement décalé à droite
    spotlight2.target.position.set(-0.05, -0.09, 4.83); // Pointe vers la position finale
    spotlight2.angle = Math.PI / 4;
    spotlight2.penumbra = 0.2;
    spotlight2.distance = 10;
    spotlightRef2.current = spotlight2;
    scene.add(spotlight2);
    scene.add(spotlight2.target);

    // Ajout d'un spotlight frontal
    const spotlight3 = new THREE.SpotLight(0x0066ff, 0);
    spotlight3.position.set(0, 0, 6.5); // Positionné devant la canette
    spotlight3.target.position.set(-0.05, -0.09, 4.83); // Pointe vers la position finale
    spotlight3.angle = Math.PI / 6; // Angle plus étroit pour un faisceau précis
    spotlight3.penumbra = 0.3;
    spotlight3.distance = 10;
    scene.add(spotlight3);
    scene.add(spotlight3.target);

    // Ajout de lumières ponctuelles pour renforcer l'effet
    const pointLight1 = new THREE.PointLight(0x0066ff, 0, 8);
    pointLight1.position.set(-0.5, 0, 4.83);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0066ff, 0, 8);
    pointLight2.position.set(0.5, 0, 4.83);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Chargement de la canette
    const loader = new GLTFLoader();
    loader.load('/assets/redbull.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -2, 4.3);
      model.scale.set(1, 1, 1);
 

      modelRef.current = model;
      scene.add(model);

      // Animation de flottement identique à SkyScene
      const floatingTl = gsap.timeline({
        repeat: -1,
        yoyo: true
      });
      
      floatingTl.to(model.position, {
        y: '-=0.01',
        duration: 2.5,
        ease: "sine.inOut"
      });

      // Animation avec ScrollTrigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top+=20% center',
        end: '+=80%',
        duration: 2,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          if (modelRef.current) {
            // Animation de montée
            modelRef.current.position.y = gsap.utils.interpolate(-2, -0.09, progress);
            modelRef.current.position.z = gsap.utils.interpolate(4.3, 4.83, progress);

            modelRef.current.rotation.y = gsap.utils.interpolate(0, Math.PI * 4, progress);


            // Mise à jour de la base de l'animation de flottement
            floatingTl.invalidate().restart();

            // Intensité des lumières
            const spotlightIntensity = gsap.utils.interpolate(0, 25, progress);
            const frontSpotlightIntensity = gsap.utils.interpolate(0, 2, progress); // Intensité plus faible pour la lumière frontale
            const pointLightIntensity = gsap.utils.interpolate(0, 8, progress);
            
            if (spotlightRef.current) {
              spotlightRef.current.intensity = spotlightIntensity;
              spotlightRef.current.target.position.y = modelRef.current.position.y;
            }
            if (spotlightRef2.current) {
              spotlightRef2.current.intensity = spotlightIntensity;
              spotlightRef2.current.target.position.y = modelRef.current.position.y;
            }
            
            // Mise à jour de la lumière frontale
            spotlight3.intensity = frontSpotlightIntensity;
            spotlight3.target.position.y = modelRef.current.position.y;
            
            // Mise à jour des positions des pointLights
            pointLight1.position.y = modelRef.current.position.y;
            pointLight2.position.y = modelRef.current.position.y;
            pointLight1.intensity = pointLightIntensity;
            pointLight2.intensity = pointLightIntensity;
          }
        }
      });
    });

    // Fonctions de hover
    const handleMouseMove = (event) => {
      if (!modelRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      };

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(modelRef.current, true);

      if (intersects.length > 0 && !isHovered.current) {
        isHovered.current = true;
        document.body.style.cursor = 'pointer';
        
        // Animation de rotation au hover
        gsap.to(modelRef.current.rotation, {
          y: modelRef.current.rotation.y + Math.PI * 2,
          duration: 1,
          ease: "power2.inOut"
        });

        // Intensification des lumières
        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            intensity: 35,
            duration: 0.5
          });
        }
        if (spotlightRef2.current) {
          gsap.to(spotlightRef2.current, {
            intensity: 35,
            duration: 0.5
          });
        }
      } else if (intersects.length === 0 && isHovered.current) {
        isHovered.current = false;
        document.body.style.cursor = 'default';
        
        // Retour à l'intensité normale des lumières
        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            intensity: 25,
            duration: 0.5
          });
        }
        if (spotlightRef2.current) {
          gsap.to(spotlightRef2.current, {
            intensity: 25,
            duration: 0.5
          });
        }
      }
    };

    // Ajouter la fonction de clic
    const handleClick = (event) => {
      if (!modelRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      };

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(modelRef.current, true);

      if (intersects.length > 0) {
        const initialPos = {
          x: modelRef.current.position.x,
          y: modelRef.current.position.y,
          z: modelRef.current.position.z
        };

        // Timeline pour le shake
        gsap.timeline()
          // Séquence de shakes rapides
          .to(modelRef.current.position, {
            x: initialPos.x - 0.02,
            y: initialPos.y + 0.02,
            duration: 0.05,
            ease: "none"
          })
          .to(modelRef.current.position, {
            x: initialPos.x + 0.02,
            y: initialPos.y - 0.02,
            duration: 0.05,
            ease: "none"
          })
          .to(modelRef.current.position, {
            x: initialPos.x - 0.015,
            y: initialPos.y + 0.015,
            duration: 0.05,
            ease: "none"
          })
          .to(modelRef.current.position, {
            x: initialPos.x + 0.015,
            y: initialPos.y - 0.015,
            duration: 0.05,
            ease: "none"
          })
          .to(modelRef.current.position, {
            x: initialPos.x - 0.01,
            y: initialPos.y + 0.01,
            duration: 0.05,
            ease: "none"
          })
          .to(modelRef.current.position, {
            x: initialPos.x,
            y: initialPos.y,
            duration: 0.05,
            ease: "none"
          })
          // Petit saut final
          .to(modelRef.current.position, {
            y: initialPos.y + 0.05,
            x: initialPos.x - 0.025,
            duration: 0.2,
            ease: "power2.out"
          })
          .to(modelRef.current.position, {
            y: initialPos.y,
            x: initialPos.x,
            duration: 0.1,
            ease: "bounce.out"
          });
      }
    };

    // Ajout des event listeners
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (floatingAnimationRef.current) {
        floatingAnimationRef.current.kill();
      }
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Cleanup des event listeners
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen cursor-pointer"
      style={{ 
        zIndex: 20,
        position: 'relative',
        pointerEvents: 'all',
      }}
    />
  );
};

export default KarmineScene; 