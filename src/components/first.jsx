import React from 'react'

export default function First() {
    return (
        <main className="relative">
          {/* Header */}
          <header className="absolute top-0 w-full flex justify-between items-center py-6 px-24 z-20">
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </header>

          <section className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden font-['RedBull']">
            {/* Traits latéraux */}
            <div className="absolute left-0 top-[30%] flex flex-col items-end z-20">
              <div className="w-56 h-[2px] bg-white"></div>
              <span className="text-white mt-4 flex justify-end text-right px-6">2024</span>
            </div>
            
            <div className="absolute right-0 top-[30%] flex flex-col items-start z-20">
              <div className="w-56 h-[2px] bg-white"></div>
              <span className="text-white mt-4 flex justify-start text-left px-6">Edition</span>
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
                <img src="/assets/redbulls.png"  alt="Red Bull Logo" className="w-96 " />
              </div>
              
              {/* Texte */}
              <p className=" text-white text-center max-w-xl text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ex vel tellus placerat laoreet
              </p>
              
              {/* Bouton */}
              <button className="mt-8 py-4 px-10 bg-white text-black rounded-xl hover:bg-opacity-90 transition-all font-black text-xl  tracking-wider">
                Explore
              </button>
            </div>
          </section>
    
       
         
        </main>
      );
    }