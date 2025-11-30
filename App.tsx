
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBooks } from './services/geminiService';
import { Book, LoadingState } from './types';
import BookCard from './components/BookCard';
import BookDetails from './components/BookDetails';
import NeuInput from './components/NeuInput';
import NeuButton from './components/NeuButton';
import AddBookModal from './components/AddBookModal';
import AdminLoginModal from './components/AdminLoginModal';

// ------------------------------------------------------------------
// PERMANENT LIBRARY CONFIGURATION
// Add new books here to make them visible to all users permanently.
// ------------------------------------------------------------------
const INITIAL_LIBRARY: Book[] = [
  {
    id: 'curated-001',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    genre: 'Self-Help',
    rating: 5.0,
    coverUrl: 'https://m.media-amazon.com/images/I/51NotqZAjPL._SL1000_.jpg',
    purchaseUrl: 'https://a.co/d/933dK6L'
  },
  // Copy the block above and paste it here to add more books...
];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  
  // Helper to get custom books from storage
  const getStoredCustomBooks = () => {
    try {
      const saved = localStorage.getItem('lumina_custom_books');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load custom books", e);
      return [];
    }
  };

  // Initialize with the permanent library + custom saved books
  const [books, setBooks] = useState<Book[]>(() => {
    return [...getStoredCustomBooks(), ...INITIAL_LIBRARY];
  });

  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Admin & Modal States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Persistent Read State
  const [readBooks, setReadBooks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('lumina_read_books');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error("Failed to load read books", e);
      return new Set();
    }
  });

  const loadBooks = async (searchTerm: string) => {
    setLoading(LoadingState.LOADING);
    try {
      const results = await fetchBooks(searchTerm);
      // When searching, we currently replace the view with search results
      setBooks(results);
      setLoading(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoading(LoadingState.ERROR);
    }
  };

  const resetLibrary = () => {
     setBooks([...getStoredCustomBooks(), ...INITIAL_LIBRARY]);
     setQuery('');
     setLoading(LoadingState.IDLE);
     window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      loadBooks(query);
      setSelectedBook(null);
    }
  };

  const handleReadNow = useCallback((book: Book) => {
    // Generate a purchase link (using custom URL or Amazon search as fallback)
    const targetUrl = book.purchaseUrl && book.purchaseUrl.trim() !== '' 
      ? book.purchaseUrl 
      : `https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`;

    // Small delay to show ripple effect before opening
    setTimeout(() => {
        window.open(targetUrl, '_blank');
    }, 300);
  }, []);

  const handleAddButtonClick = () => {
    if (isAdmin) {
      setShowAddModal(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setShowAddModal(true);
  };

  const handleAddBook = (newBookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `custom-${Date.now()}`, // Generate a unique ID
    };

    // 1. Update Persistent Storage
    const currentCustom = getStoredCustomBooks();
    const updatedCustom = [newBook, ...currentCustom];
    localStorage.setItem('lumina_custom_books', JSON.stringify(updatedCustom));

    // 2. Update Current View (Prepend to list)
    setBooks(prev => [newBook, ...prev]);
  };

  const handleToggleRead = (bookId: string) => {
    setReadBooks(prev => {
      const next = new Set(prev);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      localStorage.setItem('lumina_read_books', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-neu-base text-neu-text font-sans selection:bg-neu-accent/20 overflow-x-hidden">
      
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLoginModal 
            onClose={() => setShowAdminLogin(false)}
            onSuccess={handleAdminLoginSuccess}
          />
        )}
        {showAddModal && (
          <AddBookModal 
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddBook}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBook ? (
          <BookDetails 
            key="details"
            book={selectedBook}
            isRead={readBooks.has(selectedBook.id)}
            onToggleRead={() => handleToggleRead(selectedBook.id)}
            onBack={() => setSelectedBook(null)}
            onReadNow={handleReadNow}
          />
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Section */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-neu-base/90 backdrop-blur-md shadow-sm border-b border-white/20">
              <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={resetLibrary}
                >
                  <div className="w-10 h-10 rounded-xl bg-neu-base shadow-neu-convex flex items-center justify-center text-neu-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.958 5.832 20.477 7.5 20.477c1.664 0 3.268-.477 4.332-1.725 1.064 1.248 2.668 1.725 4.332 1.725 1.664 0 3.332-.519 3.332-1.272v-13C19.832 5.477 18.247 5 16.5 5c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-700">
                    Lumina<span className="text-neu-accent">Library</span>
                  </h1>
                </motion.div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex-grow md:w-80">
                      <NeuInput 
                        placeholder="Search by genre, author..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        }
                      />
                    </form>
                    
                    <NeuButton 
                        variant="primary" 
                        onClick={handleAddButtonClick}
                        className="!p-3 !rounded-xl flex-shrink-0"
                        title={isAdmin ? "Add Custom Book" : "Admin: Add Book"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </NeuButton>
                </div>

                <div className="hidden md:flex gap-4">
                   <NeuButton variant="icon" aria-label="Notifications">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                   </NeuButton>
                   <NeuButton variant="icon" aria-label="Profile">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                   </NeuButton>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
              
              {/* Intro / Banner */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center md:text-left"
              >
                <div className="bg-neu-base rounded-3xl p-8 shadow-neu-flat relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        Discover Your Next <span className="text-neu-accent">Masterpiece</span>
                      </h2>
                      <p className="max-w-xl text-lg text-gray-500 mb-8">
                        Explore our curated collection of books generated by AI. 
                        Find hidden gems, timeless classics, and modern bestsellers.
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                         <NeuButton onClick={() => loadBooks('Trending Tech Books')}>Tech</NeuButton>
                         <NeuButton variant="secondary" onClick={() => loadBooks('Classic Mystery Novels')}>Mystery</NeuButton>
                         <NeuButton variant="secondary" onClick={() => loadBooks('Modern Psychology')}>Psychology</NeuButton>
                         <NeuButton variant="secondary" onClick={() => loadBooks('Cyberpunk Fiction')}>Sci-Fi</NeuButton>
                      </div>
                   </div>
                   {/* Decorative Background Element */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neu-accent/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                </div>
              </motion.section>

              {/* Loading State */}
              {loading === LoadingState.LOADING && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full border-4 border-neu-base shadow-neu-flat animate-spin border-t-neu-accent mb-4"></div>
                  <p className="text-neu-text animate-pulse">Curating your collection...</p>
                </div>
              )}

              {/* Error State */}
              {loading === LoadingState.ERROR && (
                <div className="text-center py-20">
                  <h3 className="text-xl text-red-500 mb-2">Oops! Something went wrong.</h3>
                  <NeuButton onClick={() => loadBooks('Best sellers')}>Try Again</NeuButton>
                </div>
              )}

              {/* Grid */}
              {(books.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence mode="popLayout">
                    {books.map((book, index) => (
                      <BookCard 
                        key={book.id} 
                        book={book} 
                        index={index} 
                        isRead={readBooks.has(book.id)}
                        onToggleRead={() => handleToggleRead(book.id)}
                        onSelect={setSelectedBook}
                        onPurchase={handleReadNow}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Empty/Start State - Only show if absolutely no books and not loading */}
               {books.length === 0 && loading === LoadingState.IDLE && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 opacity-60"
                 >
                    <div className="w-24 h-24 rounded-full bg-neu-base shadow-neu-pressed flex items-center justify-center mb-6 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.958 5.832 20.477 7.5 20.477c1.664 0 3.268-.477 4.332-1.725 1.064 1.248 2.668 1.725 4.332 1.725 1.664 0 3.332-.519 3.332-1.272v-13C19.832 5.477 18.247 5 16.5 5c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                   <p className="text-xl text-gray-500 font-medium">Your collection is empty.</p>
                   <p className="text-sm text-gray-400 mt-2">Start by searching or adding a book!</p>
                 </motion.div>
              )}

              {books.length === 0 && loading === LoadingState.SUCCESS && (
                 <div className="text-center py-20 text-gray-500">
                   No books found. Try a different search!
                 </div>
              )}
            </main>

            {/* Sticky Footer CTA */}
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <NeuButton variant="primary" className="rounded-full w-14 h-14 !p-0 flex items-center justify-center shadow-lg shadow-neu-accent/30" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </NeuButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
