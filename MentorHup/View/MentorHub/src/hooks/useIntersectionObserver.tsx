import React from 'react';
import { Mic, Users, MessageSquare } from 'lucide-react';

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsIntersecting(true);
        setHasAnimated(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '-50px',
      ...options
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasAnimated, options]);

  return [ref, isIntersecting];
};