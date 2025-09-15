import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const HomePage = () => {
  const backgroundRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.to(backgroundRef.current, {
      backgroundPosition: '200% 0%',
      ease: 'linear',
      duration: 7,
      repeat: -1,
    });
  }, []);

  const handleExploreClick = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 2.0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => navigate('/games'),
    });
  };

  return (
    <div
      ref={backgroundRef}
      className="min-h-screen flex flex-col justify-between text-white relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(270deg, brown, #000000, brown)',
        backgroundSize: '400% 400%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div ref={containerRef} className="flex flex-col justify-between min-h-screen">

        {/* Header */}
        <header className="absolute top-5 left-5 text-3xl font-bold text-green-600 z-20 bg-red-500 o-repeat bg-contain h-20 w-20">
        <img src="/logo1.png" alt="Logo" />
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-grow text-center z-10 relative px-4">
          <h1 className="text-5xl font-extrabold text-red-500 mb-8">
            Welcome to Game Hub
          </h1>

          <button
            onClick={handleExploreClick}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded shadow-lg transition-transform duration-300"
          >
            Explore Games
          </button>
        </main>

        {/* Footer */}
        <footer className="bg-black text-white w-full py-4 border-t border-red-600 flex flex-col items-center z-20 relative">
          <div className="flex space-x-6 mb-2">
            <button
              onClick={() => navigate('/feedback')}
              className="text-red-600 hover:underline font-semibold"
            >
              Feedback
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="text-red-600 hover:underline font-semibold"
            >
              Contact
            </button>
          </div>

          <div className="text-sm text-red-600">
            &copy; {new Date().getFullYear()} Game Hub. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default HomePage;
