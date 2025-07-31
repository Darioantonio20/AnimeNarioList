import React from 'react';

const FilterButton = ({ 
  children, 
  active, 
  onClick, 
  color = 'emerald', 
  icon, 
  variant = 'default',
  size = 'md',
  disabled = false 
}) => {
  const getColorClasses = (colorName, isActive) => {
    const colorMap = {
      emerald: isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300',
      purple: isActive ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300',
      blue: isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300',
      red: isActive ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300',
      yellow: isActive ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300',
      green: isActive ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300',
      gray: isActive ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
    };
    return colorMap[colorName] || colorMap.gray;
  };

  const getSizeClasses = (sizeKey) => {
    const sizeMap = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    return sizeMap[sizeKey] || sizeMap.md;
  };

  const getVariantClasses = (variantKey) => {
    const variantMap = {
      default: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-md'
    };
    return variantMap[variantKey] || variantMap.default;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden font-medium transition-all duration-300 transform-gpu
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${getColorClasses(color, active)}
        ${active ? 'scale-105' : 'hover:scale-105'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
        active:scale-95
      `}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </span>
      
      {/* Efecto de pulso para botones activos */}
      {active && (
        <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
      )}
    </button>
  );
};

export default FilterButton; 