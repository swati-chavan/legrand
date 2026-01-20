import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Test from "./component/test";
import SearchForm from "./component/SearchForm";
import RecordViewer from "./component/RecordViewer";
import UpdateForm from "./component/UpdateForm";

function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editMode, setEditMode] = useState(false); // ← NEW STATE

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

        
        {/* Search Modal */}
        {showSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center p-5 overflow-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => setShowSearch(false)}
                className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg"
                title="Close Search"
              >
                ✕ Close
              </button>
              <div className="pt-16 pb-8 px-6">
                <SearchForm 
                  onSelectRecord={(record) => {
                    setSelectedRecord(record);
                    setShowSearch(false);
                    setEditMode(false); // ← View mode by default
                  }} 
                  onEditRecord={(record) => {
                    setSelectedRecord(record);
                    setEditMode(true); // ← Edit mode
                    setShowSearch(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Record Viewer Modal - View Mode */}
        {selectedRecord && !editMode && (
          <RecordViewer 
            record={selectedRecord} 
            onClose={() => {
              setSelectedRecord(null);
              setEditMode(false);
            }}
            onEdit={() => setEditMode(true)} // ← NEW: Edit button in viewer
          />
        )}

        {/* Edit Form Modal - Edit Mode */}
        {selectedRecord && editMode && (
          <UpdateForm
            record={selectedRecord}
            onClose={() => {
              setSelectedRecord(null);
              setEditMode(false);
            }}
            onSuccess={(updatedRecord) => {
              setSelectedRecord(updatedRecord);
              setEditMode(false); // ← Back to view mode after success
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;