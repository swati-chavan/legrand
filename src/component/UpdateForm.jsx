// EditForm.jsx - Complete with formula support & proper data handling
import React, { useState, useEffect } from 'react';
import * as API from '../component/Endpoint/Endpoint';

const UpdateForm = ({ record, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form data with deep copy
  useEffect(() => {
    if (record) {
      setFormData({
        ...record,
        status: record.status || 'submitted',
        sections: JSON.parse(JSON.stringify(record.sections || []))
      });
    }
  }, [record]);

  const handleBasicFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleFieldChange = (sectionIdx, fieldIdx, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIdx) =>
        sIdx === sectionIdx
          ? {
              ...section,
              fields: section.fields.map((field, fIdx) =>
                fIdx === fieldIdx ? { ...field, value } : field
              )
            }
          : section
      )
    }));
  };

  // ✅ NEW: Handle table cell changes WITH FORMULA RECALCULATION
  const handleTableCellChange = (sectionIdx, tableIdx, rowIdx, key, value, headerType) => {
    setFormData(prev => {
      const newSections = [...prev.sections];
      const section = newSections[sectionIdx];
      const table = section.tables[tableIdx];
      const row = table.rows[rowIdx];

      // Update the changed cell
      if (headerType === 'number') {
        row[key] = value ? parseFloat(value) : 0;
      } else {
        row[key] = value;
      }

      // ✅ RECALCULATE FUNCTION FIELDS (like Total = Qty * Price)
      table.headers?.forEach(header => {
        if (header.type === 'function') {
          const headerId = header.label.toLowerCase().replace(/\s+/g, '_');
          
          // Find qty and price columns
          const qtyHeader = table.headers.find(h => 
            h.label.toLowerCase().includes('qty') || 
            h.label.toLowerCase().includes('quantity')
          );
          const priceHeader = table.headers.find(h => 
            h.label.toLowerCase().includes('price') || 
            h.label.toLowerCase().includes('rate')
          );

          if (qtyHeader && priceHeader) {
            const qtyKey = qtyHeader.label.toLowerCase().replace(/\s+/g, '_');
            const priceKey = priceHeader.label.toLowerCase().replace(/\s+/g, '_');
            
            const qty = parseFloat(row[qtyKey]) || 0;
            const price = parseFloat(row[priceKey]) || 0;
            
            // Calculate function result
            row[headerId] = qty * price;
          }
        }
      });

      return {
        ...prev,
        sections: newSections
      };
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // ✅ FORMAT DATA EXACTLY LIKE YOUR SUBMIT FORM
//       const formattedData = {
//         id: record._id || `${record.formName}_${Date.now()}`,
//         formName: formData.formName || record.formName,
//         formTitle: formData.formTitle || record.formTitle,
//         submittedAt: formData.submittedAt || new Date().toISOString(),
//         submittedBy: formData.submittedBy || record.submittedBy,
//         status: formData.status || 'submitted',
//         sections: formData.sections || []
//       };

//       console.log("🔍 Formatted update data:", JSON.stringify(formattedData, null, 2));

// //       const response = await fetch(`${API.UpdateRecord}?id=${record._id}`, {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ 
// //       data: formData  // ← SINGLE OBJECT, not array
// //     }),
// //   });

// const response = await fetch(`${API.UpdateRecord}?id=${record._id}`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           data: [formattedData]  // ✅ WRAP IN ARRAY like submit form
//         }),
//       });
//       // Handle response
//       const responseText = await response.text();
//       console.log('📄 Raw Response:', responseText);

//       if (!response.ok) {
//         let errorMsg = 'Unknown server error';
//         try {
//           const errorData = JSON.parse(responseText);
//           errorMsg = errorData.error || errorData.message || `Server error: ${response.status}`;
//         } catch (parseErr) {
//           errorMsg = `HTTP ${response.status}: ${responseText || 'No response body'}`;
//         }
//         throw new Error(errorMsg);
//       }

//       const result = responseText ? JSON.parse(responseText) : {};
//       console.log('✅ Success Response:', result);

//       setSuccess(true);
//       setTimeout(() => onSuccess(result.data || formattedData), 1500);

//     } catch (err) {
//       console.error('❌ Full Error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };


/******************************************************************************/
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // ✅ FORMAT DATA EXACTLY LIKE YOUR SUBMIT FORM
    const formattedData = {
      _id: record._id, // ✅ ADD THIS - Your backend needs _id
      id: record._id || `${record.formName}_${Date.now()}`,
      formName: formData.formName || record.formName,
      formTitle: formData.formTitle || record.formTitle,
      submittedAt: formData.submittedAt || new Date().toISOString(),
      submittedBy: formData.submittedBy || record.submittedBy,
      status: formData.status || 'submitted',
      sections: formData.sections || []
    };

    console.log("🔍 Formatted update data:", JSON.stringify(formattedData, null, 2));

    // ✅ FIX: Remove ?id= from URL, backend gets it from formattedData._id
    const response = await fetch(API.UpdateRecord, { // ← Changed this line
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: formattedData  // ✅ SINGLE OBJECT, not array
      }),
    });

    // Handle response
    const responseText = await response.text();
    console.log('📄 Raw Response:', responseText);

    if (!response.ok) {
      let errorMsg = 'Unknown server error';
      try {
        const errorData = JSON.parse(responseText);
        errorMsg = errorData.error || errorData.message || `Server error: ${response.status}`;
      } catch (parseErr) {
        errorMsg = `HTTP ${response.status}: ${responseText || 'No response body'}`;
      }
      throw new Error(errorMsg);
    }

    const result = responseText ? JSON.parse(responseText) : {};
    console.log('✅ Success Response:', result);

    setSuccess(true);
    setTimeout(() => onSuccess(result.data || formattedData), 1500);

  } catch (err) {
    console.error('❌ Full Error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
/*****************************************************************************/

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-5 overflow-auto">
        <div className="bg-white rounded-xl max-w-2xl w-full p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Updated Successfully!</h3>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-md"
          >
            View Updated Record
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-5 overflow-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit {record?.formTitle}
          </h2>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium shadow-md"
          >
            ✕ Close
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">ID:</span>{' '}
              <span className="text-gray-900 break-all">{record?._id}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Form Name:</label>
              <input
                type="text"
                name="formName"
                value={formData.formName || ''}
                onChange={handleBasicFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Submitted By:</label>
              <input
                type="email"
                name="submittedBy"
                value={formData.submittedBy || ''}
                onChange={handleBasicFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status:</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleBasicFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Submitted At:</label>
              <input
                type="datetime-local"
                value={formData.submittedAt ? new Date(formData.submittedAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleBasicFieldChange({ target: { name: 'submittedAt', value: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sections */}
          {formData.sections?.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4 pb-3 border-b-2 border-blue-500">
                {section.sectionLabel}
              </h3>

              {/* Fields */}
              {section.fields?.length > 0 && (
                <div className="space-y-4">
                  {section.fields.map((field, fieldIdx) => (
                    <div 
                      key={fieldIdx} 
                      className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <div className="font-semibold text-gray-800 mb-1">{field.fieldLabel}:</div>
                      <input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => handleFieldChange(sectionIdx, fieldIdx, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tables with LIVE FORMULA CALCULATION */}
              {section.tables?.map((table, tableIdx) => (
                <div key={tableIdx} className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {table.tableLabel}
                  </h4>
                  <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="w-full bg-white border-collapse">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          {table.headers?.map((header, headerIdx) => (
                            <th 
                              key={headerIdx} 
                              className="px-6 py-4 text-left text-sm font-semibold border border-gray-300"
                            >
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows?.map((row, rowIdx) => (
                          <tr 
                            key={rowIdx} 
                            className={`hover:bg-gray-50 transition-colors ${
                              rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            {table.headers?.map((header, headerIdx) => {
                              const key = header.label.toLowerCase().replace(/\s+/g, '_');
                              const isFunction = header.type === 'function';
                              
                              return (
                                <td 
                                  key={headerIdx} 
                                  className="px-6 py-4 text-sm border border-gray-300"
                                >
                                  {isFunction ? (
                                    // ✅ READ-ONLY CALCULATED FIELD
                                    <input
                                      type="text"
                                      value={row[key]?.toFixed(2) || '0.00'}
                                      readOnly
                                      className="w-full px-3 py-1 border border-gray-200 rounded text-sm bg-gray-100 text-gray-700 font-semibold cursor-not-allowed"
                                    />
                                  ) : (
                                    // ✅ EDITABLE FIELD with auto-recalc
                                    <input
                                      type={header.type === 'number' ? 'number' : 'text'}
                                      step={header.type === 'number' ? '0.01' : undefined}
                                      value={row[key] ?? ''}
                                      onChange={(e) => handleTableCellChange(
                                        sectionIdx, 
                                        tableIdx, 
                                        rowIdx, 
                                        key, 
                                        e.target.value,
                                        header.type
                                      )}
                                      className="w-full px-3 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-gray-800"
                                    />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-medium text-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium shadow-md"
            >
              ✕ Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
