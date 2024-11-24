import React, { useEffect, useRef, useState } from 'react';
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
  const [clickCount, setClickCount] = useState(0);
  const [showCounter, setShowCounter] = useState(true);
  const counterRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const achievementSound = useRef(null);

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

    // Ajout du Raycaster pour les interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;

    // Gestionnaire de mouvement de souris
    const onMouseMove = (event) => {
      if (!modelRef.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(modelRef.current, true);

      if (intersects.length > 0 && !isHovered) {
        isHovered = true;
        document.body.style.cursor = 'pointer';
        gsap.to(modelRef.current.rotation, {
          y: modelRef.current.rotation.y - Math.PI * 2,
          duration: 1,
          ease: "power2.inOut"
        });
      } else if (intersects.length === 0 && isHovered) {
        isHovered = false;
        document.body.style.cursor = 'default';
      }
    };

    // Gestionnaire de clic modifié
    const onClick = (event) => {
      if (!modelRef.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(modelRef.current, true);

      if (intersects.length > 0) {
        setClickCount(prev => prev + 1);

        // Animation plus agressive du +1
        const counter = document.createElement('div');
        counter.textContent = '+1';
        counter.style.position = 'fixed';
        counter.style.left = `${event.clientX}px`;
        counter.style.top = `${event.clientY}px`;
        counter.style.color = '#3ad6ff'; // Couleur plus agressive
        counter.style.fontSize = '24px';
        counter.style.fontWeight = 'bold';
        counter.style.pointerEvents = 'none';
        counter.style.zIndex = '1000';
        document.body.appendChild(counter);

        // Animation plus dynamique du compteur
        gsap.timeline()
          .to(counter, {
            y: '-=80',
            scale: 1.5,
            duration: 0.3,
            ease: "power2.out"
          })
          .to(counter, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              document.body.removeChild(counter);
            }
          });

        // Animation plus agressive de la canette
        gsap.timeline()
          // Shake rapide
          .to(modelRef.current.rotation, {
            x: '+=0.2',
            y: '+=0.2',
            duration: 0.1,
            ease: "power2.inOut"
          })
          .to(modelRef.current.rotation, {
            x: '-=0.4',
            y: '-=0.4',
            duration: 0.1,
            ease: "power2.inOut"
          })
          .to(modelRef.current.rotation, {
            x: '+=0.2',
            y: '+=0.2',
            duration: 0.1,
            ease: "power2.inOut"
          })
          // Flash de lumière
          .to([spotlightRef.current, spotlightRef2.current], {
            intensity: '+=15',
            duration: 0.1,
            ease: "power2.in"
          })
          .to([spotlightRef.current, spotlightRef2.current], {
            intensity: '-=15',
            duration: 0.3,
            ease: "power2.out"
          });
      }
    };

    // Ajout des écouteurs d'événements
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Création du plan pour l'image de fond
    const textureLoader = new THREE.TextureLoader();
    const backgroundGeometry = new THREE.PlaneGeometry(1, 1); // Taille réduite (ajustez selon vos besoins)
    const backgroundMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load('/assets/pentakill.png'), // Votre image
      transparent: true,
      opacity: 0,
      depthTest: false, // Désactive le test de profondeur
      depthWrite: false, // Désactive l'écriture de profondeur
      renderOrder: 999 // Force l'ordre de rendu
    });
    const backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    // Positionnement ajusté (devant la canette)
    backgroundPlane.position.set(0, 0.5, 4); // Ajustez le Z pour être devant la canette
    backgroundImageRef.current = backgroundPlane;
    scene.add(backgroundPlane);

    // Précharger le son
    achievementSound.current = new Audio('/assets/sound.mp3');
    achievementSound.current.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });

    return () => {
      if (floatingAnimationRef.current) {
        floatingAnimationRef.current.kill();
      }
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Cleanup des event listeners
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      if (achievementSound.current) {
        achievementSound.current.removeEventListener('canplaythrough', () => {
          setAudioLoaded(true);
        });
      }
    };
  }, []);

  // Effet pour surveiller le compteur
  useEffect(() => {
    if (clickCount === 5 && backgroundImageRef.current && audioLoaded) {
      // Cacher immédiatement le compteur
      setShowCounter(false);

      // Réinitialiser le son si nécessaire
      achievementSound.current.currentTime = 0;
      achievementSound.current.volume = 0.5;
      
      gsap.timeline()
        .call(() => {
          achievementSound.current.play().catch(error => {
            console.log("Erreur de lecture audio:", error);
          });
        })
        // Animation d'apparition avec une taille initiale plus petite
        .fromTo(backgroundImageRef.current.scale, 
          { x: 0.5, y: 0.5 }, // Taille initiale
          { x: 0.8, y: 0.8, duration: 0.5, ease: "back.out" } // Taille finale
        )
        .to(backgroundImageRef.current.material, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        }, "<");

      // Créer un élément de texte pour l'achievement
      const achievementText = document.createElement('div');
      achievementText.textContent = 'ACHIEVEMENT UNLOCKED!';
      achievementText.style.position = 'fixed';
      achievementText.style.left = '50%';
      achievementText.style.top = '70%';
      achievementText.style.transform = 'translate(-50%, -50%)';
      achievementText.style.color = '#3ad6ff';
      achievementText.style.fontSize = '32px';
      achievementText.style.fontWeight = 'bold';
      achievementText.style.fontFamily = 'RedBull2';
      achievementText.style.textAlign = 'center';
      achievementText.style.zIndex = '1000';
      achievementText.style.opacity = '0';
      document.body.appendChild(achievementText);

      // Animation synchronisée du texte et de l'image
      gsap.timeline()
        .to(achievementText, {
          opacity: 1,
          y: -20,
          duration: 0.5,
          ease: "power2.out"
        })
        .to(achievementText, {
          opacity: 0,
          duration: 0.5,
          delay: 3, // Attendre 3 secondes avant de disparaître
          ease: "power2.in",
          onComplete: () => {
            document.body.removeChild(achievementText);
            // Faire disparaître l'image en même temps
            gsap.to(backgroundImageRef.current.material, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.in"
            });
          }
        });
    }
  }, [clickCount, audioLoaded]);

  return (
    <>
      <div 
        ref={containerRef}
        className="relative w-full h-screen cursor-pointer"
        style={{ 
          zIndex: 20,
          position: 'relative',
          pointerEvents: 'all',
        }}
      />
      {/* Affichage conditionnel du compteur */}
      {showCounter && (
        <div 
          className="absolute top-[25%] left-[50%] text-[#3ad6ff] text-4xl font-bold translate-x-[-50%] font-redbull2"
          style={{ zIndex: 1000 }}
        >
          Kills: {clickCount}
        </div>
      )}
    </>
  );
};

export default KarmineScene; 