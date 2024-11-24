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

    // Lumière latérale gauche
    const leftLight = new THREE.SpotLight(0xffffff, 0);
    leftLight.position.set(-2, 0, 5);
    leftLight.angle = Math.PI / 6;
    leftLight.penumbra = 0.3;
    leftLight.distance = 10;
    scene.add(leftLight);

    // Target pour la lumière latérale
    const leftLightTarget = new THREE.Object3D();
    leftLightTarget.position.set(-0.05, -0.09, 4.83); // Position finale de la canette
    scene.add(leftLightTarget);
    leftLight.target = leftLightTarget;

    // Ajout du Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;

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
        onUpdate: function() {
          // Utiliser this.progress() au lieu de self.progress
          leftLight.intensity = gsap.utils.interpolate(0, 1.5, this.progress());
          // Mettre à jour la base de l'animation de flottement
          floatingTl.invalidate().restart();
        }
      })
      .to(model.rotation, {
        y: 0,
        duration: 2,
        ease: "power3.inOut"
      }, "<");

      // Remplacer les anciens événements mouseenter/mouseleave par onMouseMove
      const onMouseMove = (event) => {
        if (!modelRef.current) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(modelRef.current, true);

        if (intersects.length > 0 && !isHovered) {
          isHovered = true;
          document.body.style.cursor = 'pointer';
          animationRef.current.pause();
          
          gsap.to(modelRef.current.scale, {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            duration: 0.5,
            repeat: 1,
            yoyo: true,
            ease: "power2.inOut"
          });
        } else if (intersects.length === 0 && isHovered) {
          isHovered = false;
          document.body.style.cursor = 'default';
          animationRef.current.resume();
        }
      };

      // Remplacer l'événement onClick existant
      const onClick = (event) => {
        if (!modelRef.current) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(modelRef.current, true);

        if (intersects.length > 0) {
          // Sauvegarder la position et rotation initiales
          const initialPos = {
            x: modelRef.current.position.x,
            y: modelRef.current.position.y,
            z: modelRef.current.position.z
          };
          const initialRot = {
            x: modelRef.current.rotation.x,
            y: modelRef.current.rotation.y,
            z: modelRef.current.rotation.z
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

      // Ajouter les écouteurs d'événements
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('click', onClick);

      return () => {
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('click', onClick);
        document.body.style.cursor = 'default';
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