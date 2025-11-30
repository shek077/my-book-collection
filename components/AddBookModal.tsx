import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NeuButton from './NeuButton';
import NeuInput from './NeuInput';
import { Book } from '../types';

interface AddBookModalProps {
  onClose: () => void;
  onAdd: (book: Omit<Book, 'id'>) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    rating: 4.5,
    description: '',
    coverTheme: '',
    purchaseUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title: formData.title || 'Untitled Book',
      author: formData.author || 'Unknown Author',
      genre: formData.genre || 'General',
      rating: Number(formData.rating),
      description: formData.description || 'No description provided.',
      coverUrl: `https://picsum.photos/seed/${(formData.coverTheme || formData.title).replace(/\s/g, '')}/400/600`,
      purchaseUrl: formData.purchaseUrl || undefined
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        className="relative bg-neu-base rounded-3xl p-8 shadow-neu-flat w-full max-w-lg overflow-hidden border border-white/20"
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Add Custom Book</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeuInput 
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
            autoFocus
          />
          
          <div className="grid grid-cols-2 gap-4">
            <NeuInput 
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <NeuInput 
              name="genre"
              placeholder="Genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <NeuInput 
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="Rating (0-5)"
              value={formData.rating}
              onChange={handleChange}
            />
            <NeuInput 
              name="coverTheme"
              placeholder="Cover Theme (e.g. Space)"
              value={formData.coverTheme}
              onChange={handleChange}
            />
          </div>

          <NeuInput 
            name="purchaseUrl"
            placeholder="Purchase Link (Optional URL)"
            value={formData.purchaseUrl}
            onChange={handleChange}
          />

          <textarea
            name="description"
            rows={3}
            placeholder="Short description..."
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-neu-base text-neu-text placeholder-gray-400 rounded-2xl p-4 shadow-neu-pressed focus:outline-none focus:ring-2 focus:ring-neu-base/50 transition-all duration-300 resize-none"
          />

          <div className="flex gap-4 pt-4">
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
              Add to Library
            </NeuButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBookModal;