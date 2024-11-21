import React from 'react'

export default function First() {
    return (
        <main className="relative">
          <section className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
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
            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* Logo RedBull */}
              <div className="flex flex-col items-center gap-4">
                
                <img src="/assets/redbulls.png" alt="Red Bull Logo" className="w-96" />
              </div>
              
              {/* Texte */}
              <p className="text-white text-center max-w-xl text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ex vel tellus placerat laoreet
              </p>
              
              {/* Bouton */}
              <button className="mt-8 py-5 px-10 bg-white text-black rounded-xl hover:bg-opacity-90 transition-all">
                fall down
              </button>
            </div>
          </section>
    
       
         
        </main>
      );
    }