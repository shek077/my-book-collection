import React from 'react';

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const NeuInput: React.FC<NeuInputProps> = ({ icon, className = '', ...props }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <div className="absolute left-4 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-neu-base text-neu-text placeholder-gray-400 rounded-2xl py-4 pr-6 
          shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-neu-base/50 transition-all duration-300
          ${icon ? 'pl-12' : 'pl-6'}`}
        {...props}
      />
    </div>
  );
};

export default NeuInput;
