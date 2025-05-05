import React from 'react';

const Title = ({ text = "Hola Mundo", className = "" }) => {
  return (
    <h1 className={`text-5xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ${className}`}>
      {text}
    </h1>
  );
};

export default Title; 