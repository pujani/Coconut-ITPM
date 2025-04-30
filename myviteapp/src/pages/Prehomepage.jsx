import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/solid';
import { motion, useTransform, useViewportScroll } from 'framer-motion';

const Prehomepage = () => {
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

  const VideoBackground = () => (
    <motion.div 
      className="absolute inset-0 z-0 transform-gpu overflow-hidden"
      style={{ scale }}
    >
      <iframe
        src={`https://www.youtube.com/embed/l_a-o7MhLqs?autoplay=1&mute=1&loop=1&playlist=l_a-o7MhLqs&controls=0&modestbranding=1&rel=0&playsinline=1&autohide=1&showinfo=0`}
        className="absolute h-[56.25vw] w-[177.78vh] min-h-full min-w-full object-cover"
        style={{ 
          transform: isLoaded ? 'scale(1.1) translateY(-5%)' : 'scale(1)',
          transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        playsInline
        webkit-playsinline="true"
        loading="eager"
        title="Coco-Nut Brand Film"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/95" />
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <VideoBackground />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="max-w-6xl px-4 sm:px-6 lg:px-8">
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
              className="text-gradient font-display text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block bg-clip-text text-transparent">
                WELCOME TO COCO-NUT
              </span>
              <motion.span 
                className="mt-6 block text-1xl font-medium text-emerald-100/90 sm:mt-8 sm:text-2xl md:text-3xl"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }}}
              >
                🥥 Join us in revolutionizing the coconut industry !
              </motion.span>
            </motion.h1>

            <motion.div 
              className="mt-16 sm:mt-20"
              variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 }}}
            >
              <Link
                to="/homepage"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-14 py-6 text-xl font-bold text-white shadow-2xl transition-all duration-500 hover:shadow-emerald-500/30 md:px-20 md:py-7 md:text-2xl"
                style={{
                  background: 'linear-gradient(135deg,             #047857  0%,             #047857  100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <span className="relative z-10 flex items-center gap-4">
                  Start Up
                  <ArrowRightIcon className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 sm:bottom-16"
          >
            <div className="animate-float flex flex-col items-center gap-3">
              <ChevronDoubleDownIcon className="h-10 w-10 text-emerald-200/80" />
              <div className="h-12 w-px bg-gradient-to-t from-emerald-200/80 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .animate-float {
          animation: float 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

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

        .font-display {
          font-family: var(--font-display), ui-sans-serif, system-ui;
        }
      `}</style>
    </motion.div>
  );
};

export default Prehomepage;