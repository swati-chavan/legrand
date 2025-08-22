// src/ContactForm.js

import React, { useState } from 'react';
// import './ContactForm.css'; // Optional: use your main.css here
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const navigate = useNavigate();

const handleEdit = (record) => {
  navigate(`/edit/${record._id}`, { state: record });
};


  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", formData);
    // Add email sending logic here (e.g., via EmailJS, backend API, etc.)
  };

  return (
    <div className="contact1">
      <div className="container-contact1">
        <div className="contact1-pic">
          <img src="images/img-01.png" alt="IMG" />
        </div>

        <form className="contact1-form" onSubmit={handleSubmit}>
          <span className="contact1-form-title">Get in touch</span>

          <div className="wrap-input1">
            <input
              className="input1"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>

          <div className="wrap-input1">
            <input
              className="input1"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>

          <div className="wrap-input1">
            <input
              className="input1"
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>

          <div className="wrap-input1">
            <textarea
              className="input1"
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <span className="shadow-input1"></span>
          </div>

          <div className="container-contact1-form-btn">
            <button className="contact1-form-btn" type="submit">
              <span>
                Send Email
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
