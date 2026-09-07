import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const BackgroundAtmosphere: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background transition-colors duration-500">
      {/* Premium subtle glass/noise pattern or mesh */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]" />

      {/* Elegant atmospheric glowing elements */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5 pointer-events-none"
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-500/5 pointer-events-none"
            animate={{
              x: [0, -60, 40, 0],
              y: [0, 50, -40, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-[40%] left-[30%] w-[35%] h-[35%] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none"
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Overlay to ensure readability */}
      <div className="absolute inset-0 bg-background/20 dark:bg-background/40 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
};
