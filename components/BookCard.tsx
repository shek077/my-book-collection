
import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onPurchase: (book: Book) => void;
  index: number;
  isRead: boolean;
  onToggleRead: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onPurchase, index, isRead, onToggleRead }) => {
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetUrl = book.purchaseUrl && book.purchaseUrl.trim() !== '' 
      ? book.purchaseUrl 
      : `https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}`,
          url: targetUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${book.title} by ${book.author}\n${targetUrl}`);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <motion.div
      layoutId={`card-container-${book.id}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={() => onSelect(book)}
      className="bg-neu-base rounded-3xl p-6 shadow-neu-flat flex flex-col items-center text-center h-full cursor-pointer group hover:shadow-neu-convex transition-shadow duration-300 relative z-0"
    >
      <motion.div 
        layoutId={`book-cover-${book.id}`}
        className="relative w-40 h-60 mb-6 rounded-xl overflow-hidden shadow-neu-convex ring-4 ring-neu-base group-hover:scale-105 transition-transform duration-500"
      >
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-neu-base/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm text-xs font-bold text-neu-text z-10">
          ★ {book.rating}
        </div>

        {/* Read Status Toggle */}
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggleRead();
            }}
            className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
                isRead 
                ? 'bg-neu-base text-green-500 shadow-neu-pressed' 
                : 'bg-neu-base/80 backdrop-blur-md text-gray-400 shadow-neu-flat hover:text-gray-600'
            }`}
            title={isRead ? "Mark as Unread" : "Mark as Read"}
        >
            {isRead ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
            )}
        </button>

      </motion.div>

      <motion.h3 
        layoutId={`book-title-${book.id}`}
        className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 w-full" 
        title={book.title}
      >
        {book.title}
      </motion.h3>
      <motion.p 
        layoutId={`book-author-${book.id}`}
        className="text-sm text-neu-text/80 mb-3 font-medium"
      >
        {book.author}
      </motion.p>
      
      <p className="text-xs text-gray-500 mb-6 line-clamp-3 leading-relaxed px-2 flex-grow">
        {book.description}
      </p>

      <div className="w-full mt-auto flex gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(book);
          }}
          className="flex-1 py-3 rounded-xl bg-neu-base shadow-neu-convex text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-neu-text hover:shadow-neu-flat active:shadow-neu-pressed transition-all duration-300 outline-none"
        >
          Details
        </button>

        <button 
            onClick={handleShare}
            className="w-12 rounded-xl bg-neu-base shadow-neu-convex text-gray-500 hover:text-neu-accent hover:shadow-neu-flat active:shadow-neu-pressed transition-all duration-300 flex items-center justify-center outline-none"
            title="Share"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
             </svg>
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPurchase(book);
          }}
          className="flex-1 py-3 rounded-xl bg-neu-base shadow-neu-flat text-neu-accent text-xs font-bold uppercase tracking-wider hover:text-indigo-600 active:shadow-neu-pressed transition-all duration-300 outline-none flex items-center justify-center gap-1"
        >
          <span>Buy</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default BookCard;
