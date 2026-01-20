import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onSearchClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-6 max-w-5xl mx-auto bg-slate-800">
      <div className="container mx-auto flex justify-between  text-white">
        {/* /*flex justify-between items-center*/ }
        {/* Brand */}
        <Link to="/" className="text-xl font-semibold">Home</Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden block text-gray-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Search Button with Icon */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-400 hover:text-black text-white rounded-lg transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search</span>
          </button>
      </div>
    </nav>
  );
}

export default Navbar;
