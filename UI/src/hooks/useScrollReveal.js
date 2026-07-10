import { useState, useEffect, useRef, useMemo } from 'react';

// Opciones estables por defecto para evitar re-crear el observer
const DEFAULT_OPTIONS = {
  rootMargin: '200px 0px 50px 0px', // margen grande arriba y abajo para que las tarjetas comiencen a revelarse MUCHO antes de ser visibles → scroll suave
  threshold: 0.01,
};

export const useScrollReveal = (customOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const ref = useRef(null);

  // Retraso aleatorio más corto (0-180ms) para que se sienta ágil pero desincronizado
  const randomDelay = useRef(Math.floor(Math.random() * 180));
  // Duración más rápida (500-700ms) para una transición fluida sin esperar demasiado
  const randomDuration = useRef(Math.floor(500 + Math.random() * 200));

  // Estabilizar las opciones para evitar re-render loops
  const options = useMemo(() => customOptions || DEFAULT_OPTIONS, [customOptions]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasRendered(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return {
    ref,
    isVisible,
    hasRendered,
    delay: randomDelay.current,
    duration: randomDuration.current,
  };
};
