import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../types';
import NeuButton from './NeuButton';

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
  onReadNow: (book: Book) => void;
  isRead: boolean;
  onToggleRead: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onBack, onReadNow, isRead, onToggleRead }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-neu-base overflow-y-auto min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative min-h-full flex flex-col justify-center">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-6 left-6 z-20"
        >
          <NeuButton variant="icon" onClick={onBack} className="!rounded-full w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NeuButton>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Image Section - Transitions from Card */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <motion.div 
              layoutId={`book-cover-${book.id}`}
              className="relative w-64 h-96 lg:w-[450px] lg:h-[650px] rounded-3xl overflow-hidden shadow-neu-flat ring-8 ring-neu-base"
            >
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-center font-medium tracking-wider text-sm opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                 {book.genre} Collection
              </div>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            >
              <motion.h2 
                layoutId={`book-genre-${book.id}`}
                className="text-sm font-bold tracking-[0.2em] text-neu-accent uppercase mb-4"
              >
                {book.genre}
              </motion.h2>
              <motion.h1 
                layoutId={`book-title-${book.id}`}
                className="text-4xl lg:text-7xl font-black text-gray-800 mb-4 leading-[1.1]"
              >
                {book.title}
              </motion.h1>
              <motion.p 
                layoutId={`book-author-${book.id}`}
                className="text-xl lg:text-2xl text-gray-500 font-medium"
              >
                by <span className="text-gray-700">{book.author}</span>
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neu-base p-8 rounded-3xl shadow-neu-pressed max-w-2xl mx-auto lg:mx-0 border border-white/40"
            >
               <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">Synopsis</h3>
               <p className="text-gray-600 leading-relaxed text-lg lg:text-xl font-light">
                 {book.description} {book.description}
                 {/* Duplicating description for visual length if short */}
               </p>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
               className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4"
            >
              <NeuButton 
                onClick={() => onReadNow(book)}
                className="!px-10 !py-4 text-xl bg-neu-accent !text-white !shadow-neu-convex hover:!shadow-neu-pressed flex items-center gap-3 transition-all transform hover:-translate-y-1"
              >
                <span>Read Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </NeuButton>

              <NeuButton 
                variant="secondary"
                onClick={onToggleRead}
                className={`!px-8 !py-4 text-lg flex items-center gap-2 transition-all ${isRead ? '!text-green-600 !shadow-neu-pressed' : ''}`}
              >
                {isRead ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Finished</span>
                    </>
                ) : (
                    <span>Mark as Read</span>
                )}
              </NeuButton>
              
              <div className="flex flex-col items-center lg:items-start ml-0 sm:ml-4">
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-400">{book.rating} Rating Score</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;