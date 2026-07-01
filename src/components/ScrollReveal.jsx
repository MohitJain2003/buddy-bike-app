import React, { useEffect, useRef, useState } from 'react';

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
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -20px 0px'
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

  const child = React.Children.only(children);
  const revealClass = `reveal reveal-${animation} ${isVisible ? 'visible' : ''} ${child.props.className || ''}`.trim();

  return React.cloneElement(child, {
    ref: (node) => {
      containerRef.current = node;
      const { ref } = child;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    className: revealClass,
    style: {
      ...child.props.style,
      transitionDelay: `${delay}ms`,
    }
  });
};

export default ScrollReveal;
