import { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ 
  children, 
  animation = 'slide-up', 
  delay = 0, 
  threshold = 0.05 
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once the element is visible, we can stop observing it
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -20px 0px' // offset so it triggers slightly before entry
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const revealClass = `reveal reveal-${animation} ${isVisible ? 'visible' : ''}`;

  return (
    <div 
      ref={containerRef} 
      className={revealClass}
      style={{
        transitionDelay: `${delay}ms`,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
