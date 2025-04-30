import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/solid';
import { motion, useTransform, useViewportScroll } from 'framer-motion';

const Video = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    };

    loadYouTubeAPI();
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      <motion.div 
        className="absolute inset-0 z-0 transform-gpu overflow-hidden"
        style={{ scale }}
      >
        <iframe
          src={`https://www.youtube.com/embed/hIjzJ-vRRCQ?autoplay=1&mute=1&loop=1&playlist=hIjzJ-vRRCQ&controls=0&modestbranding=1&rel=0&playsinline=1`}
          className="absolute h-[56.25vw] w-[177.78vh] min-h-full min-w-full object-cover"
          style={{ 
            transform: isLoaded ? 'scale(1.1) translateY(-5%)' : 'scale(1)',
            transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          playsInline
          webkit-playsinline="true"
          title="Coco-Nut Brand Film"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/95" />
      </motion.div>

    
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h1 
              variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}}
              className="text-gradient font-display text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
            >
              <span className="block bg-clip-text text-transparent">
              Buy & Sell Coconut Products and More!
              </span>
            </motion.h1>

            <motion.p 
              className="mt-6 text-lg text-gray-200 max-w-xl mx-auto md:text-xl lg:text-xl"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }}}
            >
              Discover the best place to buy and sell coconut-related products and more. Connect with trusted sellers and find quality items with ease
            </motion.p>

          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .text-gradient {
          background-image: linear-gradient(
            45deg,
rgb(255, 123, 0) 15%,
rgb(255, 255, 255) 45%,
            #047857 85%
          );
          background-clip: text;
          background-size: 250% 250%;
          animation: gradient-shift 12s ease infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Video;







