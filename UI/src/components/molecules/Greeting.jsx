import React from 'react';
import Title from '../atoms/Title';

const Greeting = ({ title = "Hola Mundo", subtitle = "Bienvenido a mi aplicación con Atomic Design" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Title text={title} />
      <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
        {subtitle}
      </p>
    </div>
  );
};

export default Greeting; 