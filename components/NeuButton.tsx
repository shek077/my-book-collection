import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NeuButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

const NeuButton: React.FC<NeuButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative overflow-hidden transition-all duration-300 ease-in-out outline-none focus:outline-none";
  
  const variants = {
    primary: "px-6 py-3 rounded-xl bg-neu-base shadow-neu-flat text-neu-accent font-semibold hover:text-indigo-600 active:shadow-neu-pressed",
    secondary: "px-4 py-2 rounded-lg bg-neu-base shadow-neu-convex text-gray-500 text-sm hover:text-gray-700 active:shadow-neu-pressed",
    icon: "p-3 rounded-full bg-neu-base shadow-neu-flat text-neu-text hover:text-neu-accent active:shadow-neu-pressed flex items-center justify-center",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeuButton;
