import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dynamic = () => {
  const navigate = useNavigate();

  const slides = [
    {
      image: 'https://coconuthandbook.tetrapak.com/sites/coconut/files/chapter/images/chap3_3.jpg',
      title: "Expert Cultivation Guidance",
      text: "Learn professional techniques for optimal coconut tree growth and yield enhancement."
    },
    {
      image: 'http://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSxnAdqwjI-B6rWnqwGZgjP_OLxnkAD_nUuJ4STMEG-K1boRgTwL1pwd50PUxUQxgTjfpie0YGIRFrPmOTAJTQ',
      title: "Soil & Nutrition Management",
      text: "Discover the perfect soil composition and nutrient balance for healthy coconut palms."
    },
    {
      image: 'https://parachutekalpavriksha.org/cdn/shop/articles/Drought_management_and_soil_moisture_conservation_for_coconut_farming.jpg?v=1711263172&width=1000',
      title: "Climate Adaptation Strategies",
      text: "Master drought management and moisture conservation techniques for coconut farming."
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        setOpacity(1);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleClick = () => {
    navigate('/addland');
  };

  return (
    <section 
      className="relative h-[500px] flex items-center justify-center overflow-hidden cursor-pointer" 
      onClick={handleClick}
      role="button" 
      tabIndex={0} 
    >
   
      <div className="absolute inset-0 z-0 transition-opacity duration-500" style={{ opacity }}>
        <img
          src={slides[currentSlideIndex].image}
          alt="Coconut cultivation techniques"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

   
      <div className="relative z-10 text-center max-w-2xl px-4 transition-opacity duration-500" style={{ opacity }}>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up">
          {slides[currentSlideIndex].title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          {slides[currentSlideIndex].text}
        </p>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Dynamic;