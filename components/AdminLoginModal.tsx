
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NeuButton from './NeuButton';
import NeuInput from './NeuInput';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration purposes
    if (password === 'admin') {
      onSuccess();
    } else {
      setError(true);
      // Shake animation trigger or just error state could be added here
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neu-base/60 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-neu-base rounded-3xl p-8 shadow-neu-flat w-full max-w-sm overflow-hidden border border-white/20"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-neu-base shadow-neu-flat flex items-center justify-center text-neu-accent mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-700">Admin Access</h2>
          <p className="text-sm text-gray-500 mt-1">Verify to add new books</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <NeuInput 
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              className={error ? 'ring-2 ring-red-400/50' : ''}
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-2 ml-2 font-medium absolute -bottom-5 left-0"
              >
                Incorrect password. Hint: 'admin'
              </motion.p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <NeuButton 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </NeuButton>
            <NeuButton 
              type="submit" 
              variant="primary"
              className="flex-1"
            >
              Unlock
            </NeuButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLoginModal;
