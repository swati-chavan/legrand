import React, { useState } from 'react';
import * as API from '../component/Endpoint/Endpoint';

const FormSearch = ({ onSelectRecord }) => {
  const [searchParams, setSearchParams] = useState({
    formName: '',
    submittedBy: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    searchText: ''
  });
  const [searchResults, setSearchResults] = useState([]);   
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

//   const handleSearch = async (skipValue = 0) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Build query string
//       const params = new URLSearchParams();
//       Object.keys(searchParams).forEach(key => {
//         if (searchParams[key]) {
//           params.append(key, searchParams[key]);
//         }
//       });
//       params.append('skip', skipValue);
//       params.append('limit', 20);

//       const response = await fetch(`${API.SearchRecords}&${params.toString()}`);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || 'Search failed');
//       }

//       setSearchResults(result.data);
//       setPagination(result.pagination);
//     } catch (err) {
//       setError(err.message);
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };


/************************************************************************************************************************/
const handleSearch = async (skipValue = 0) => {
  setLoading(true);
  setError(null);

  try {
    // Build query string with PROPER DATE FORMATTING
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        if (key === 'dateFrom') {
          // Convert YYYY-MM-DD to YYYY-MM-DD 00:00:00 start of day
          params.append(key, `${searchParams[key]}T00:00:00.000Z`);
        } else if (key === 'dateTo') {
          // Convert YYYY-MM-DD to YYYY-MM-DD 23:59:59 end of day
          params.append(key, `${searchParams[key]}T23:59:59.999Z`);
        } else {
          params.append(key, searchParams[key]);
        }
      }
    });
    params.append('skip', skipValue);
    params.append('limit', 10);

    console.log('Search params:', params.toString()); // Debug log

    const response = await fetch(`${API.SearchRecords}&${params.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Search failed');
    }

    setSearchResults(result.data);
    setPagination(result.pagination);
  } catch (err) {
    setError(err.message);
    console.error('Search error:', err);
  } finally {
    setLoading(false);
  }
};

/************************************************************************************************************************/



  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleViewRecord = async (recordId) => {
    try {
      const response = await fetch(`${API.GetRecord}&id=${recordId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load record');
      }

      onSelectRecord(result.data);
    } catch (err) {
      alert('Error loading record: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Form Submissions</h2>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-5 bg-gray-100 rounded-lg">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Form Name
          </label>
          <input
            type="text"
            name="formName"
            value={searchParams.formName}
            onChange={handleInputChange}
            placeholder="e.g., Purchase"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Submitted By
          </label>
          <input
            type="text"
            name="submittedBy"
            value={searchParams.submittedBy}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Status
          </label>
          <select
            name="status"
            value={searchParams.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Date From
          </label>
          <input
            type="date"
            name="dateFrom"
            value={searchParams.dateFrom}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Date To
          </label>
          <input
            type="date"
            name="dateTo"
            value={searchParams.dateTo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            Search Text
          </label>
          <input
            type="text"
            name="searchText"
            value={searchParams.searchText}
            onChange={handleInputChange}
            placeholder="Search in all fields"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div> */}
      </div>

      {/* Search Button */}
      <div className="mb-6">
        <button
          onClick={() => handleSearch(0)}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 font-medium text-base shadow-md"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Results Table */}
      {/* Results Table - FIXED WIDTHS */}
{/* Results Table - NO SCROLL, UNIFORM FONT */}
{searchResults.length > 0 && (
  <>
    <div className="shadow-md rounded-lg mb-6">
      <table className="w-full bg-white border-collapse">
        <thead className='rounded-lg '>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg ">
            <th className="w-[28%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-500/30">ID</th>
            <th className="w-[12%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-500/30">Form Name</th>
            <th className="w-[20%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-500/30">Submitted By</th>
            <th className="w-[10%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-500/30">Status</th>
            <th className="w-[20%] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-500/30">Submitted At</th>
            <th className="w-[10%] px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((record, index) => (
            <tr 
              key={record._id}
              className={`border-b border-gray-200 hover:bg-blue-50 transition-all duration-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              <td className="w-[22%] px-2 py-1 text-xs font-medium text-gray-900 truncate max-w-[220px]">
                {record._id}
              </td>
              <td className="w-[12%] px-2 py-1 text-xs font-medium text-gray-900">
                {record.formName}
              </td>
              <td className="w-[20%] px-2 py-1 text-xs font-medium text-gray-900 truncate max-w-[160px]">
                {record.submittedBy}
              </td>
              <td className="w-[10%] px-2 py-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  record.status === 'submitted' 
                    ? 'bg-yellow-400 text-yellow-900 border border-yellow-300' 
                    : record.status === 'approved' 
                    ? 'bg-green-400 text-green-900 border border-green-300' 
                    : 'bg-red-400 text-red-900 border border-red-300'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="w-[15%] px-4 py-3 text-xs font-medium text-gray-900">
                {formatDate(record.submittedAt)}
              </td>
              <td className="w-[8%] px-1 py-1 text-center">
                <button
                  onClick={() => handleViewRecord(record._id)}
                  className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-semibold rounded-md hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {pagination && (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="text-xs text-gray-700 font-medium">
          Showing {pagination.skip + 1} - {Math.min(pagination.skip + pagination.limit, pagination.total)} of{' '}
          <span className="font-bold text-blue-600">{pagination.total}</span> results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSearch(Math.max(0, pagination.skip - pagination.limit))}
            disabled={pagination.skip === 0}
            className="px-4 py-1.5 bg-gray-300 text-gray-700 text-xs font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-all duration-200 shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => handleSearch(pagination.skip + pagination.limit)}
            disabled={!pagination.hasMore}
            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </>
)}



      {/* No Results */}
      {!loading && searchResults.length === 0 && (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg">
          No results found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default FormSearch;
