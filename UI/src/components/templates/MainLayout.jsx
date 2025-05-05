import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Atomic Design</h2>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
      
      <footer className="py-6 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Mi Aplicación con Atomic Design
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 