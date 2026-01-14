import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Test from "./component/test";
import SearchForm from "./component/SearchForm";
import RecordViewer from "./component/RecordViewer";

function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar - Always visible */}
        <div className="bg-slate-800 shadow-lg">
          <Navbar onSearchClick={() => setShowSearch(true)} />
        </div>
        
        {/* Main Content Area */}
        <Routes>
          {/* Home page - Dynamic Form */}
          <Route path="/" element={<Test />} />
        </Routes>

        {/* Search Modal - Overlay */}
        {showSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center p-5 overflow-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setShowSearch(false)}
                className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg"
                title="Close Search"
              >
                ✕ Close
              </button>

              {/* Search Component */}
              <div className="pt-16 pb-8 px-6">
                <SearchForm 
                  onSelectRecord={(record) => {
                    setSelectedRecord(record);
                    setShowSearch(false);
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Record Viewer Modal - Show selected record */}
        {selectedRecord && (
          <RecordViewer 
            record={selectedRecord} 
            onClose={() => setSelectedRecord(null)} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
