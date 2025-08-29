import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Or use any other spinner you prefer
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactForm() {
  const location = useLocation();
  const record = location.state; // The record passed from SearchPage
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState(record ? 'Update' : 'Submit');
  const [isDisabled, setIsDisabled] = useState(false); // To disable the button during submission


  const [formData, setFormData] = useState({
    // RFC
    requestForChangeNo: '',
    dateRequest: '',
    requestedBy: '',

    // Affected Product Information
    effectedItemsInSyspro: '',
    productDescription: '',
    UF: '',
    SM: '',
    PCB: '',
    revisionOrSoftwareNumber: '',

    // Issue description
    issueCircumstance: '',
    changeReasonProblemStatement: '',
    proposedSolution: '',
    costToBeSavedBreakdown: '',

    // Type of Change (checkboxes)
    correctiveAction: false,
    safetyIssue: false,
    costImprovement: false,
    manufacturability: false,
    customerRequest: false,
    other: false,

    // RFC Approval
    dateSigned: '',
    signedBy: '',
    statusApproval: '',
    reasonForDenial: '',

    // For updates
    _id: '',
  });

useEffect(() => {
  if (record && record.fields) {
    // Map from description to formData key
    const descToKeyMap = {
      "Request for Change No: RFC_DEP1234 partNumber shortDescription": "requestForChangeNo",
      "Date Request": "dateRequest",
      "Requested By": "requestedBy",
      "Effected Items in Syspro": "effectedItemsInSyspro",
      "Product's Description": "productDescription",
      "UF(s)": "UF",
      "SM(s)": "SM",
      "PCB": "PCB",
      "Revision and or Software number": "revisionOrSoftwareNumber",
      "Issue circumstance:": "issueCircumstance",
      "Change Reason/Problem Statement:": "changeReasonProblemStatement",
      "Proposed Solution:": "proposedSolution",
      "Cost to be Saved Breakdown (Include Labor)": "costToBeSavedBreakdown",
      "Corrective Action": "correctiveAction",
      "Safety Issue": "safetyIssue",
      "Cost Improvement": "costImprovement",
      "Manufacturability": "manufacturability",
      "Customer Request": "customerRequest",
      "Other": "other",
      "Date Signed": "dateSigned",
      "Signed by": "signedBy",
      "Status": "statusApproval",
      "Reason for Denial": "reasonForDenial",
    };

    const flatData = {};
    record.fields.forEach(({ description, value }) => {
      const key = descToKeyMap[description];
      if (key !== undefined) {
        flatData[key] = value;
      }
    });

    setFormData({
      ...formData,
      ...flatData,
      _id: record._id || '',
    });
  }


   if (!record) {
    // Reset form for new submission
    setFormData({
      requestForChangeNo: '',
      dateRequest: '',
      requestedBy: '',
      effectedItemsInSyspro: '',
      productDescription: '',
      UF: '',
      SM: '',
      PCB: '',
      revisionOrSoftwareNumber: '',
      issueCircumstance: '',
      changeReasonProblemStatement: '',
      proposedSolution: '',
      costToBeSavedBreakdown: '',
      correctiveAction: false,
      safetyIssue: false,
      costImprovement: false,
      manufacturability: false,
      customerRequest: false,
      other: false,
      dateSigned: '',
      signedBy: '',
      statusApproval: '',
      reasonForDenial: '',
      _id: '',
    });
  }
}, [record]);


  const fieldMetadata = {
  requestForChangeNo: {
    responsibility: "Requester",
    description: "Request for Change No: RFC_DEP1234 partNumber shortDescription",
  },
  dateRequest: {
    responsibility: "Requester",
    description: "Date Request",
  },
  requestedBy: {
    responsibility: "Requester",
    description: "Requested By",
  },
  effectedItemsInSyspro: {
    responsibility: "Requester",
    description: "Effected Items in Syspro",
  },
  productDescription: {
    responsibility: "Requester",
    description: "Product's Description",
  },
  UF: {
    responsibility: "Requester",
    description: "UF(s)",
  },
  SM: {
    responsibility: "Requester",
    description: "SM(s)",
  },
  PCB: {
    responsibility: "Requester",
    description: "PCB",
  },
  revisionOrSoftwareNumber: {
    responsibility: "Requester",
    description: "Revision and or Software number",
  },
  issueCircumstance: {
    responsibility: "Requester",
    description: "Issue circumstance:",
  },
  changeReasonProblemStatement: {
    responsibility: "Requester",
    description: "Change Reason/Problem Statement:",
  },
  proposedSolution: {
    responsibility: "Requester",
    description: "Proposed Solution:",
  },
  costToBeSavedBreakdown: {
    responsibility: "Requester",
    description: "Cost to be Saved Breakdown (Include Labor)",
  },
  correctiveAction: {
    responsibility: "Requester",
    description: "Corrective Action",
  },
  safetyIssue: {
    responsibility: "Requester",
    description: "Safety Issue",
  },
  costImprovement: {
    responsibility: "Requester",
    description: "Cost Improvement",
  },
  manufacturability: {
    responsibility: "Requester",
    description: "Manufacturability",
  },
  customerRequest: {
    responsibility: "Requester",
    description: "Customer Request",
  },
  other: {
    responsibility: "Requester",
    description: "Other",
  },
  dateSigned: {
    responsibility: "Dep Manager",
    description: "Date Signed",
  },
  signedBy: {
    responsibility: "Dep Manager",
    description: "Signed by",
  },
  statusApproval: {
    responsibility: "Dep Manager",
    description: "Status",
  },
  reasonForDenial: {
    responsibility: "Dep Manager",
    description: "Reason for Denial",
  },
};


  const issueDescriptionOptions = {
  issueCircumstance: [
    "Design flaw",
    "Manufacturing error",
    "Customer feedback",
    "Cost saving opportunity",
    "Compliance requirement",
    "Other"
  ],
  changeReasonProblemStatement: [
    "Incorrect specs",
    "Obsolete components",
    "Improvement in performance",
    "Safety concern",
    "Regulatory change"
  ],
  proposedSolution: [
    "Redesign PCB",
    "Use alternative components",
    "Update documentation",
    "Software patch",
    "Customer notification"
  ],
  costToBeSavedBreakdown: [
    "Material reduction",
    "Labor cost",
    "Energy efficiency",
    "Waste reduction",
    "Process automation"
  ]
};


const rfcApprovalOptions = {
  dateSigned: ["2025-08-20", "2025-08-21", "2025-08-22"],
  signedBy: ["Manager A", "Manager B", "Manager C"],
  statusApproval: ["Approved", "Rejected", "Pending"],
  reasonForDenial: [
    "Insufficient Justification",
    "Budget Constraints",
    "Lack of Resources",
    "Not Required"
  ]
};


  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Transform formData into an array of { description, responsibility, value }
  const transformedData = Object.entries(formData).map(([key, value]) => {
    if (key === '_id') return null; // Skip _id from transformation

    const meta = fieldMetadata[key] || { description: key, responsibility: 'Unknown' };

    return {
      description: meta.description,
      responsibility: meta.responsibility,
      value: value,
    };
  }).filter(Boolean); // Remove nulls


    setIsLoading(true);
    setIsDisabled(true); // Disable the button
    setButtonText('Processing...'); // Change button text to "Processing..."


  await new Promise(resolve => setTimeout(() => resolve(), 2000)); // Directly resolve inside setTimeout

  const isUpdate = !!formData._id;

  const payload = isUpdate
    ? { _id: formData._id, data: transformedData } // Include _id for updates
    : { data: transformedData }; // Create only needs datads dfafd



  const endpoint = isUpdate
    ? 'https://legrandfunctionapp-g0g4gdgyc6c3a8dy.centralindia-01.azurewebsites.net/api/UpdateUserForm?code=LhEicokpEx2lcYRDJXAlhPNKrsz9BMduYMCZ02Zie2nVAzFutTUjBg=='
    : 'https://legrandfunctionapp-g0g4gdgyc6c3a8dy.centralindia-01.azurewebsites.net/api/CreateRecord?code=BTt9HVQ3hIImeNAc6H-7vjveDB_yIgmka9p261sl2niCAzFuaYCRfw==';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // Send correct payload
    });

    if (response.ok) {
      toast.success(isUpdate ? 'Record updated successfully!' : 'Form submitted successfully!');
        setButtonText(isUpdate ? 'Update' : 'Submit'); // Set back to original text after submission


            if (!isUpdate) {
        setFormData({
          requestForChangeNo: '',
          dateRequest: '',
          requestedBy: '',
          effectedItemsInSyspro: '',
          productDescription: '',
          UF: '',
          SM: '',
          PCB: '',
          revisionOrSoftwareNumber: '',
          issueCircumstance: '',
          changeReasonProblemStatement: '',
          proposedSolution: '',
          costToBeSavedBreakdown: '',
          correctiveAction: false,
          safetyIssue: false,
          costImprovement: false,
          manufacturability: false,
          customerRequest: false,
          other: false,
          dateSigned: '',
          signedBy: '',
          statusApproval: '',
          reasonForDenial: '',
          _id: '',
        });
      }

    } else {
      toast.error('Failed to submit form.');

    }
  } catch (error) {
    console.error('Request error:', error);
      toast.error('An error occurred.');

    // alert('An error occurred.');
  }  finally {
    // Hide loader after submission (whether success or error)
    setIsLoading(false);
        setIsDisabled(false); // Re-enable the button

  }
};



  return (
    <div className="contact1">
      <div className="container-contact1">
        {/* <div className="contact1-pic js-tilt" data-tilt>
          <img src="/images/img-01.png" alt="IMG" />
        </div> */}

        <form className="contact1-form" onSubmit={handleSubmit}>
          <span className="contact1-form-title">{record ? 'Edit Submission' : 'Get in touch'}</span>
          {/* Loading Spinner */}
          {isLoading && (
            <div className="loading-spinner">
              <ClipLoader color="#36d7b7" loading={isLoading} size={50} />
            </div>
          )}

          {/* Stage 1: RFC */}
          <h3 className="contact1-form-title" style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
            Stage 1: RFC
          </h3>

          <div className='row'>
         
          <div className="wrap-input1 col-md-4">
            <input
              className="input1"
              type="text"
              name="requestForChangeNo"
              placeholder="Request for Change No"
              value={formData.requestForChangeNo}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          <div className="wrap-input1 col-md-4">
            <input
              className="input1"
              type="date"
              name="dateRequest"
              placeholder="Date Request"
              value={formData.dateRequest}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
             

          <div className="wrap-input1 col-md-4">
            <input
              className="input1"
              type="text"
              name="requestedBy"
              placeholder="Requested By"
              value={formData.requestedBy}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          </div>

          {/* Stage 2: Affected Product Information */}
          <h3 className="contact1-form-title" style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
            Stage 2: Affected Product Information
          </h3>
            <div className='row'>

          <div className="wrap-input1 col-md-6">
            <textarea
              className="input1"
              type="text"
              name="effectedItemsInSyspro"
              placeholder="Effected Items in Syspro"
              value={formData.effectedItemsInSyspro}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          <div className="wrap-input1 col-md-6">
            <textarea
              className="input1"
              type="text"
              name="productDescription"
              placeholder="Product's Description"
              value={formData.productDescription}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          </div>

          <div className='row'>

          <div className="wrap-input1 col-md-6">
            <input
              className="input1"
              type="text"
              name="UF"
              placeholder="UF(s)"
              value={formData.UF}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          <div className="wrap-input1 col-md-6">
            <input
              className="input1"
              type="text"
              name="SM"
              placeholder="SM(s)"
              value={formData.SM}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          </div>

          <div className='row'>
          <div className="wrap-input1 col-md-6">
            <input
              className="input1"
              type="text"
              name="PCB"
              placeholder="PCB(s)"
              value={formData.PCB}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          <div className="wrap-input1 col-md-6">
            <input
              className="input1"
              type="text"
              name="revisionOrSoftwareNumber"
              placeholder="Revision or Software Number"
              value={formData.revisionOrSoftwareNumber}
              onChange={handleChange}
              required
            />
            <span className="shadow-input1"></span>
          </div>
          </div>
          {/* Stage 3: Issue Description */}
          {/* Stage 3: Issue Description */}
          <h3 className="contact1-form-title" style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
            Stage 3: Issue Description
          </h3>
          <div className='row'>
            <div className="wrap-input1 col-md-6">
              <select
                className="input1"
                name="issueCircumstance"
                value={formData.issueCircumstance}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue Circumstance</option>
                {issueDescriptionOptions.issueCircumstance.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
              <span className="shadow-input1"></span>
            </div>

            <div className="wrap-input1 col-md-6">
              <select
                className="input1"
                name="changeReasonProblemStatement"
                value={formData.changeReasonProblemStatement}
                onChange={handleChange}
                required
              >
                <option value="">Select Change Reason</option>
                {issueDescriptionOptions.changeReasonProblemStatement.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
              <span className="shadow-input1"></span>
            </div>
          </div>

          <div className='row'>
            <div className="wrap-input1 col-md-6">
              <select
                className="input1"
                name="proposedSolution"
                value={formData.proposedSolution}
                onChange={handleChange}
                required
              >
                <option value="">Select Proposed Solution</option>
                {issueDescriptionOptions.proposedSolution.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
              <span className="shadow-input1"></span>
            </div>

            <div className="wrap-input1 col-md-6">
              <select
                className="input1"
                name="costToBeSavedBreakdown"
                value={formData.costToBeSavedBreakdown}
                onChange={handleChange}
                required
              >
                <option value="">Select Cost Saving</option>
                {issueDescriptionOptions.costToBeSavedBreakdown.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
              <span className="shadow-input1"></span>
            </div>
          </div>


          {/* Stage 4: Type of Change */}
          <h3 className="contact1-form-title" style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
            Stage 4: Type of Change
          </h3>
          
          <div className='row'>
          <div className="wrap-input1" style={{ display: 'flex',justifyContent:'space-between',  flexWrap: "wrap", flexDirection: 'row', gap: '8px' }}>
            {[
              { name: 'correctiveAction', label: 'Corrective Action' },
              { name: 'safetyIssue', label: 'Safety Issue' },
              { name: 'costImprovement', label: 'Cost Improvement' },
              { name: 'manufacturability', label: 'Manufacturability' },
              { name: 'customerRequest', label: 'Customer Request' },
              { name: 'other', label: 'Other' },
            ].map(({ name, label }) => (
              <label className='col-md-3' key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name]}
                  onChange={handleChange}
                />
                {label}
              </label>
            ))}
          </div>
          </div>

          {/* Stage 5: RFC Approval */}
          {/* Stage 5: RFC Approval */}
          <h3 className="contact1-form-title" style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
            Stage 5: RFC Approval
          </h3>

          <div className="row">
            {Object.entries(rfcApprovalOptions).map(([fieldName, options]) => (
              <div key={fieldName} className="wrap-input1 col-md-6" style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                  {fieldName
                    .replace(/([A-Z])/g, ' $1')       // Split camelCase
                    .replace(/^./, str => str.toUpperCase())} {/* Capitalize */}
                </label>
                {options.map((option, index) => (
                  <label key={index} style={{ display: 'block' }}>
                    <input
                      type="radio"
                      name={fieldName}
                      value={option}
                      checked={formData[fieldName] === option}
                      onChange={handleChange}
                    />
                    {option}
                  </label>
                ))}
                <span className="shadow-input1"></span>
              </div>
            ))}
          </div>

          <div className='row'>

          <div className="container-contact1-form-btn col-md-12" style={{ marginTop: '2rem' }}>
            <button 
              className="contact1-form-btn" 
              type="submit" 
              disabled={isDisabled} // Disable button when submitting
            >
                              {isLoading &&               <ClipLoader color="#fdfdfdff"  loading={isLoading}  size={20} />}

              <span style={{ marginLeft: '10px' }}>
              

          {/* // <ClipLoader color="#fff" size={20} style={{ marginLeft: '10px' }} /> */}
          
            {buttonText} {/* Show Processing... text while loading */}
              </span>
            </button>
          </div>
            </div>

        </form>
      </div>


      
      {/* Add ToastContainer for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </div>
  );
}

export default ContactForm;
