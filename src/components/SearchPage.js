// src/SearchPage.js
import React, { useState } from 'react';
import './SearchPage.css';
import { useHistory } from 'react-router-dom';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);


const history = useHistory();

const handleEdit = (record) => {
  history.push({
    pathname: `/edit/${record._id}`,
    state: record
  });
};

  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://legrandfunctionapp-g0g4gdgyc6c3a8dy.centralindia-01.azurewebsites.net/api/SearchUserForm?code=OtN9UbZ_ka9Ss7NdRrvni30-6MigCepRCdGwBlINfrwJAzFuI-X4bA==&search=${encodeURIComponent(search)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="search-wrapper">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="container mt-4">
        <div className="text-center mb-4">
          <h3>Results</h3>
          {loading && <p>Loading...</p>}
          {!loading && results.length === 0 && <p>No results found.</p>}
        </div>

        {results.map((record) => (
          <div className="card mb-3" key={record._id}>
            <div className="card-body">
              <div className="d-flex flex-column flex-lg-row align-items-center" >
                <span className="avatar avatar-text rounded-3 me-4 mb-2">
                  {record.fullName ? record.fullName.slice(0, 2).toUpperCase() : 'NA'}
                </span>
                <div className="row flex-fill align-items-center" style={{width:"100%"}}>
                  <div className="col-sm-3">
                    <h4 className="h5">{record.fullName}</h4>
                    <p>{record.email}</p>
                    <p>{record.phoneNumber}</p>
                  </div>
                  <div className="col-sm-3 py-2">
                    <span className="badge bg-secondary p-2 mr-2">{record.status}</span>
                    <span className="badge bg-info p-2">{record.submissionDate}</span>
                  </div>
                  <div className="col-sm-3 text-lg-end">
                    <p className="mb-0"><strong>Comments:</strong> {record.comments}</p>
                    {/* Optional: Add edit or delete buttons here */}
                  </div>

                 <div className="col-sm-3 text-lg-end">
                  <button                     className="btn btn-dark me-2" onClick={() => handleEdit(record)}>Edit</button>

                 </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
