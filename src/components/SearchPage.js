import React, { useState } from 'react';
import './SearchPage.css';
import { useHistory } from 'react-router-dom';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleEdit = (record) => {
    console.log("record",record);
    history.push({
      pathname: `/edit/${record._id}`,
      state: record
    });
  };

  // Helper function to get value by description from fields array
  const getFieldValue = (fields, description) => {
    const field = fields.find(f => f.description === description);
    if (field) {
      if (typeof field.value === 'boolean') return field.value ? 'Yes' : 'No';
      return field.value;
    }
    return 'N/A';
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
            placeholder="Search by any field..."
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

        {results.map((record) => {
          const fields = record.fields || [];

          // Extract main values
          const title = getFieldValue(fields, "Request for Change No: RFC_DEP1234 partNumber shortDescription");
          const dateRequest = getFieldValue(fields, "Date Request");
          const requestedBy = getFieldValue(fields, "Requested By");
          const status = getFieldValue(fields, "Status");
          const comments = getFieldValue(fields, "Reason for Denial"); // or use another field if comments exists

          return (
            <div className="card mb-3" key={record._id}>
              <div className="card-body">
                <div className="d-flex flex-column flex-lg-row align-items-center" >
                  <span className="avatar avatar-text rounded-3 me-4 mb-2">
                    {title ? title.slice(0, 2).toUpperCase() : 'NA'}
                  </span>
                  <div className="row flex-fill align-items-center" style={{width:"100%"}}>
                    <div className="col-sm-3">
                      <h4 className="h5">{title}</h4>
                      <p><strong>Date Request:</strong> {dateRequest}</p>
                      <p><strong>Requested By:</strong> {requestedBy}</p>
                    </div>
                    <div className="col-sm-3 py-2">
                      <span className={`badge ${status === 'Approved' ? 'bg-success' : 'bg-secondary'} p-2`}>{status}</span>
                    </div>
                    <div className="col-sm-4 text-lg-end">
                      <p className="mb-0"><strong>Comments:</strong> {comments}</p>
                    </div>
                    <div className="col-sm-2 text-lg-end">
                      <button className="btn btn-dark me-2" onClick={() => handleEdit(record)}>Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;
