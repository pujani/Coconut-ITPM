import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Notepost = () => {
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdContent = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/note/getnote");
        setNotes(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        console.error("Error fetching ad content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdContent();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [notes.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100">
        <div className="animate-pulse text-lg text-gray-600">Loading featured content...</div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100">
        <div className="text-lg text-gray-600">No featured content available</div>
      </div>
    );
  }

  const currentNote = notes[currentIndex];

  return (
    <section className="relative h-[400px] overflow-hidden ">
      <div className="absolute inset-0 z-0 opacity-90">
        <img
          src={`http://localhost:5001/uploads/${currentNote.NImage}`}
          alt={currentNote.NName}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-emerald-900/40" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl text-white">
            <h1 className="text-4xl md:text-4xl font-bold mb-6 leading-tight animate-slide-up">
              {currentNote.NName}
            </h1>
            
            <p className="text-lg md:text-2xl  mb-8 opacity-90 leading-relaxed">
              {currentNote.NNote}
            </p>

      
          </div>
        </div>
      </div>

     
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {notes.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Notepost;