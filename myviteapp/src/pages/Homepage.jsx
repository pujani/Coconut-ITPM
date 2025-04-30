import React, { useEffect, useRef, useState } from 'react';
import Homeproductlist from '../components/Homeproductlist';
import Homecoconutlist from '../components/Homecoconutlist';
import Layout from '../components/Layout';
import Layoutt from '../components/Layoutt';
import Video from '../components/Video';
import Dynamic from '../components/Dynamic';
import Notepost from '../components/Notepost';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const containerRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight, 
        behavior: 'smooth', 
      });
    }
  }, []);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop } = containerRef.current;
    setShowButton(scrollTop > 200);
  };

  useEffect(() => {
    const currentContainer = containerRef.current;
    currentContainer?.addEventListener('scroll', checkScroll);
    return () => currentContainer?.removeEventListener('scroll', checkScroll);
  }, []);

  

  const handleAi = (e) => {
    navigate('/#')
  }



  return (
    <div className="bg-white h-screen overflow-y-auto" ref={containerRef}>
      <Layoutt>
        <Layout>
          <div className="mt-6 text-left">
            <Video />
            <Homeproductlist />
            <Dynamic />
            <Homecoconutlist />
            <Notepost />
            <br/>
          </div>
        </Layout>
      </Layoutt>

      {showButton && (
        <button 
          onClick={handleAi}
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-500 transition-colors duration-200 animate-bounce"
          aria-label="Scroll to top"
        >
         <div className="relative group">
  <button 
    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    aria-describedby="ai-tooltip"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-6 w-6 text-gray-800"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8.5 9.5c0-1.5 3-4 3-4s3 2.5 3 4M8.5 14.5c0 1.5 3 4 3 4s3-2.5 3-4M14.5 15l-1.5-3-3 1.5-1.5-3"
      />
    </svg>
  </button>
  
 
  <div 
    id="ai-tooltip"
    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block 
               bg-gray-800 text-white text-sm px-3 py-1 rounded-md 
               after:content-[''] after:absolute after:top-full after:left-1/2
               after:-translate-x-1/2 after:border-8 after:border-x-transparent 
               after:border-b-transparent after:border-t-gray-800"
  >
    AI Assistant 

    <span className="sr-only">(AI Help)</span>
  </div>
</div>
        </button>
      )}
    </div>
  );
};

export default Homepage;