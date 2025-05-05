import React from 'react';
import Greeting from '../molecules/Greeting';

const HomeContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <Greeting />
      
      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        ¡Empezar ahora!
      </button>
    </div>
  );
};

export default HomeContent; 