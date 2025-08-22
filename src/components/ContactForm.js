import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ContactForm() {
  const location = useLocation();
  const record = location.state; // The record passed from SearchPage

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    submissionDate: '',
    status: 'Pending',
    comments: '',
    confirmDetails: false, // must be explicitly set false initially

  });

  
  // Prefill data when editing
  useEffect(() => {
    if (record) {
      setFormData({
        _id: record._id || '', // ✅ Add this line

        fullName: record.fullName || '',
        email: record.email || '',
        phoneNumber: record.phoneNumber || '',
        submissionDate: record.submissionDate?.split('T')[0] || '', // Remove time from ISO date
        status: record.status || 'Pending',
        comments: record.comments || ''
      });
    }
  }, [record]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const isUpdate = !!formData._id;

  const endpoint = isUpdate
    ? 'https://legrandfunctionapp-g0g4gdgyc6c3a8dy.centralindia-01.azurewebsites.net/api/UpdateUserForm?code=LhEicokpEx2lcYRDJXAlhPNKrsz9BMduYMCZ02Zie2nVAzFutTUjBg=='  // replace with your actual URL
    : 'https://legrandfunctionapp-g0g4gdgyc6c3a8dy.centralindia-01.azurewebsites.net/api/CreateRecord?code=BTt9HVQ3hIImeNAc6H-7vjveDB_yIgmka9p261sl2niCAzFuaYCRfw==';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert(isUpdate ? 'Record updated successfully!' : 'Form submitted successfully!');
      // Optionally reset or navigate back
    } else {
      alert('Failed to submit form.');
    }
  } catch (error) {
    console.error('Request error:', error);
    alert('An error occurred.');
  }
};


  return (
    <div className="contact1">
      <div className="container-contact1">
        <div className="contact1-pic js-tilt" data-tilt>
          <img src="/images/img-01.png" alt="IMG" />
        </div>

        <form className="contact1-form" onSubmit={handleSubmit}>
          <span className="contact1-form-title">
            {record ? "Edit Submission" : "Get in touch"}
          </span>

          {/* Full Name */}
          <div className="wrap-input1">
            <input
              className="input1"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>

          {/* Email Address */}
          <div className="wrap-input1">
            <input
              className="input1"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>

          {/* Phone Number */}
          <div className="wrap-input1">
            <input
              className="input1"
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (+91-XXX-XXX-XXXX)"
              pattern="\+91-\d{3}-\d{3}-\d{4}"
              title="Phone number format: +91-XXX-XXX-XXXX"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <span className="shadow-input1"></span>
          </div>

          {/* Date of Submission */}
          <div className="wrap-input1">
            <input
              className="input1"
              type="date"
              name="submissionDate"
              value={formData.submissionDate}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>

          {/* Status */}
          <div className="wrap-input1">
            <select
              className="input1"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span className="shadow-input1"></span>
          </div>

          {/* Comments */}
          <div className="wrap-input1">
            <textarea
              className="input1"
              name="comments"
              placeholder="Comments (optional)"
              value={formData.comments}
              onChange={handleChange}
            ></textarea>
            <span className="shadow-input1"></span>
          </div>
          {/* Confirm Details Checkbox */}
          <div className="wrap-input1" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0" }}>
            <input
              type="checkbox"
              name="confirmDetails"
              checked={formData.confirmDetails}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmDetails" style={{ margin: 0 }}>
              I confirm the above details are correct
           </label>
          </div>

          <div className="container-contact1-form-btn">
            <button className="contact1-form-btn" type="submit">
              <span>
                {record ? "Update" : "Submit"}
                <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
