import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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

        {/* Menu Items */}
        <div className={`lg:flex lg:space-x-6 ${isOpen ? "block" : "hidden"} mt-2 lg:mt-0`}>
          <Link to="/" className="block lg:inline-block hover:text-gray-400">Contact</Link>
          <Link to="/search" className="block lg:inline-block hover:text-gray-400">Search</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
