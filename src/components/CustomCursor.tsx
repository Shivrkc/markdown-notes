import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text' | 'drag'>('default');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || shouldReduceMotion) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect cursor type based on element or classes/attributes
      const isPointer = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer');

      const isText = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('[contenteditable="true"]') ||
        target.closest('.cursor-text');

      const isDrag = target.closest('.cursor-grab') || target.closest('.cursor-grabbing');

      if (isDrag) {
        setCursorType('drag');
      } else if (isPointer) {
        setCursorType('pointer');
      } else if (isText) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible, shouldReduceMotion]);

  if (shouldReduceMotion || typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  // Define sizes and styles for different cursor states
  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(59, 130, 246, 0.4)', // transparent-ish primary
      border: '1px solid rgba(59, 130, 246, 0.8)',
    },
    pointer: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '2px solid rgba(59, 130, 246, 1)',
    },
    text: {
      width: 4,
      height: 24,
      borderRadius: 2,
      backgroundColor: 'rgba(59, 130, 246, 1)',
      border: '0px solid transparent',
    },
    drag: {
      width: 24,
      height: 24,
      backgroundColor: 'rgba(168, 85, 247, 0.2)', // indigo/purple for drag
      border: '2px dashed rgba(168, 85, 247, 0.8)',
    }
  };

  const innerVariants = {
    default: { scale: 1 },
    pointer: { scale: 0 },
    text: { scale: 0 },
    drag: { scale: 1.5, backgroundColor: 'rgba(168, 85, 247, 1)' }
  };

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="fixed pointer-events-none rounded-full z-[9999] mix-blend-difference flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={cursorType}
        variants={variants}
        initial="default"
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      {/* Inner Immediate Dot */}
      <motion.div
        className="fixed pointer-events-none w-2 h-2 rounded-full bg-primary z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        animate={cursorType}
        variants={innerVariants}
        initial="default"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
};
