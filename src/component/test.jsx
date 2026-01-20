import React, { useState, useEffect } from 'react';
import * as API from './Endpoint/Endpoint'
import { toast } from 'react-toastify';


export default function Test() {
  const [schemas, setSchemas] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const [currentSchema, setCurrentSchema] = useState(null);
  const [tableRows, setTableRows] = useState({});
  //const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // hello
  // Fetch list of available forms on component mount
  useEffect(() => {
    fetchFormsList();
  }, []);

  const fetchFormsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API.LIST_FORM_NAME);
      if (!response.ok) {
        throw new Error('Failed to fetch forms list');
      }
      const data = await response.json();
      setSchemas(data);
    } catch (err) {
      setError('Error loading forms: ' + err.message);
      console.error('Error fetching forms list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific form schema when form is selected
  useEffect(() => {
    if (selectedForm) {
      fetchFormSchema(selectedForm);
    }
  }, [selectedForm]);

  const fetchFormSchema = async (Form) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${API.GET_FORM_SCHEMA}&formName=${Form}`);
    if (!response.ok) {
      throw new Error('Failed to fetch form schema');
    }

    const schema = await response.json();
    setCurrentSchema(schema);

    const initialData = {};
    const initialRows = {};

    schema.Sections?.forEach((section) => {
      section.Fields?.forEach((field) => {

        // Normal fields
        if (field.Section === "Fields" && field.Type !== "Subsection") {
          initialData[field.id] = "";
        }

        // Table initialization
        if (field.Section === "Line_Items" && field.Type === "Table") {
          initialRows[field.id] = [{ id: 0 }];

          field.Headers?.forEach((header) => {
            const key = `${field.id}-0-${header.label}`;
            initialData[key] = header.Type === "number" ? 0 : "";
          });
        }
      });
    });

    setFormData(initialData);
    setTableRows(initialRows);

  } catch (err) {
    setError('Error loading form schema: ' + err.message);
  } finally {
    setLoading(false);
  }
};

//**************************************************************************************************/
  const handleChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleTableChange = (tableId, rowIdx, headerId, value) => {
    const key = `${tableId}-${rowIdx}-${headerId}`;
    //console.log(key)
    setFormData(prev => ({ ...prev, [key]: value }));
  };
/***********************************************************************************************/

const addRow = (field) => {
  if (!field.AllowAddRows) return;

  const rows = [...(tableRows[field.id] || [])];
  const newIdx = rows.length;

  rows.push({ id: newIdx });
  setTableRows(prev => ({ ...prev, [field.id]: rows }));

  let newForm = { ...formData };
  field.Headers?.forEach(h => {
    const headerId = h.id || h.Label.replace(/\s+/g, "_").toLowerCase();
    const key = `${field.id}-${newIdx}-${headerId}`;
    //console.log(key)
    newForm[key] = h.Type === "number" ? 0 : "";
  });

  setFormData(newForm);
};


/**************************************************************************************************************************/

// Edit the record

// Load editing record when it changes
  // useEffect(() => {
  //   if (editingRecord) {
  //     loadRecordForEditing(editingRecord);
  //   }
  // }, [editingRecord]);

  // const loadRecordForEditing = (record) => {
  //   setIsEditMode(true);
  //   setCurrentRecordId(record._id);
  //   setSelectedForm(record.formName);
    
  //   // Load the schema first
  //   const schema = schemas.find(s => s.Form === record.formName);
  //   setCurrentSchema(schema);

  //   // Populate form data
  //   const loadedFormData = {};
  //   const loadedTableRows = {};

  //   record.sections?.forEach((section) => {
  //     // Load regular fields
  //     section.fields?.forEach((field) => {
  //       loadedFormData[field.fieldId] = field.value;
  //     });

  //     // Load table data
  //     section.tables?.forEach((table) => {
  //       loadedTableRows[table.tableId] = table.rows.map(() => ({}));
        
  //       table.rows.forEach((row, rowIdx) => {
  //         Object.entries(row).forEach(([key, value]) => {
  //           const fieldKey = `${table.tableId}-${rowIdx}-${key}`;
  //           loadedFormData[fieldKey] = value;
  //         });
  //       });
  //     });
  //   });

  //   setFormData(loadedFormData);
  //   setTableRows(loadedTableRows);
  // };



/*************************************************************************************************************************/

  const deleteRow = (field, rowIdx) => {
    if (!field.AllowDeleteRows) return;
    const rows = [...(tableRows[field.id] || [])];
    if (rows.length <= 1) return;
    
    const newRows = rows.filter((_, idx) => idx !== rowIdx);
    setTableRows(prev => ({ ...prev, [field.id]: newRows }));
    
    const newFormData = { ...formData };
    Object.keys(formData).forEach(key => {
      if (key.startsWith(`${field.id}-${rowIdx}-`)) {
        delete newFormData[key];
      }
    });
    
    newRows.forEach((row, newIdx) => {
      if (newIdx >= rowIdx) {
        field.Headers?.forEach(h => {
          const headerId = h.id || h.Label.replace(/\s+/g, '_').toLowerCase();
          const oldKey = `${field.id}-${newIdx + 1}-${headerId}`;
            const newKey = `${field.id}-${newIdx}-${headerId}`;
            //console.log(newKey)
          if (formData[oldKey] !== undefined) {
            newFormData[newKey] = formData[oldKey];
            delete newFormData[oldKey];
          }
        });
      }
    });
    
    setFormData(newFormData);
  };

  const evaluateFormula = (field, formula, rowIdx) => {
    try {
      const vars = {};
      field.Headers?.forEach(h => {
        const headerId = h.id || h.Label.replace(/\s+/g, '_').toLowerCase();
        const key = `${field.id}-${rowIdx}-${headerId}`;
        let value = formData[key];
        if (h.Type === 'number' || !isNaN(Number(value))) {
          value = Number(value) || 0;
        }
        vars[h.Label] = value;
        vars[h.Label.replace(/\s+/g, "_")] = value;
      });
      
      const processedFormula = formula.replace(/\b(\w+(?:\s+\w+)*)\b/g, m => m.replace(/\s+/g, "_"));
      const fn = new Function(...Object.keys(vars), `return ${processedFormula};`);
      const result = fn(...Object.values(vars));
      return typeof result === "number" ? (result % 1 === 0 ? result : result.toFixed(2)) : result;
    } catch {
      return "ERR";
    }
  };

  const renderTableInput = (field, header, rowIdx) => {
    const headerId = header.id || header.Label.replace(/\s+/g, '_').toLowerCase();
    const key = `${field.id}-${rowIdx}-${headerId}`;
    const value = formData[key] ?? (header.Type === "number" ? 0 : "");

    //console.log(key);
    
    if (header.Type === "function") {
      return (
        <div className="p-2 bg-gray-100 text-center font-semibold">
          {evaluateFormula(field, header.Formula, rowIdx)}
        </div>
      );
    }
    
    if (header.Type === "number") {
      return (
        <input
          key={key}
          type="number"
          value={value}
          onChange={e => handleTableChange(field.id, rowIdx, headerId, e.target.value)}
          disabled={header.Readonly}
          className="border border-gray-300 rounded p-2 w-full"
        />
      );
    }
    
    return (
      <input
        key={key}
        type="text"
        value={value}
        onChange={e => handleTableChange(field.id, rowIdx, headerId, e.target.value)}
        disabled={header.Readonly}
        className="border border-gray-300 rounded p-2 w-full"
      />
    );
  };

  const renderTable = (field) => {
    return (
      <div className="col-span-2 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{field.Label}</h3>
          {field.AllowAddRows && (
            <button
              onClick={() => addRow(field)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Add Row
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {field.Headers?.map((h) => (
                  <th key={h.id} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    {h.Label}
                  </th>
                ))}
                {field.AllowDeleteRows && (
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableRows[field.id]?.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  {field.Headers?.map((header) => (
                    <td key={header.id} className="border border-gray-300 p-2">
                      {renderTableInput(field, header, rowIdx)}
                    </td>
                  ))}
                  {field.AllowDeleteRows && (
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => deleteRow(field, rowIdx)}
                        disabled={tableRows[field.id].length <= 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderField = (field) => {
    if (field.Section === "Line_Items" && field.Type === "Table") {
      return renderTable(field);
    }
    
    if (field.Section !== "Fields") return null;
    
    const value = formData[field.id] || "";
    
    if (field.Type === "Subsection") {
      return (
        <div className="col-span-2 bg-gray-200 px-4 py-3 font-bold text-gray-700 border-b border-gray-300">
          {field.Label}
        </div>
      );
    }
    
    return (
      <React.Fragment key={field.id}>
        <div className="border-r border-b border-gray-300 px-4 py-3 bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
          {field.Label}
          {field.HoverData && (
            <span className="text-blue-600 cursor-help" title={field.HoverData}>ⓘ</span>
          )}
        </div>
        <div className="border-b border-gray-300 px-4 py-3">
          {field.Type === "Text" && (
            <textarea
              value={value}
              onChange={e => handleChange(field.id, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full min-h-20"
              placeholder={`Enter ${field.Label.toLowerCase()}`}
            />
          )}
          {field.Type === "Date_Select" && (
            <input
              type="date"
              value={value}
              onChange={e => handleChange(field.id, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          )}
          {field.Type === "Select" && (
            <select
              value={value}
              onChange={e => handleChange(field.id, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="">Select...</option>
              {field.Options?.map((opt) => (
                <option key={opt.id} value={opt.Value}>
                  {opt.Label}
                </option>
              ))}
            </select>
          )}
          {field.Type === "Radio" && (
            <div className={`flex ${field.ClassName === "Form_Radio_Horizontal" ? "flex-row gap-4" : "flex-col gap-2"}`}>
              {field.Options?.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.id}
                    value={opt.Value}
                    checked={value === String(opt.Value)}
                    onChange={e => handleChange(field.id, e.target.value)}
                    className="cursor-pointer"
                  />
                  <span>{opt.Label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  const renderSection = (section) => {
    return (
      <div key={section.id} className="mb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">{section.Label}</h2>
          </div>
          <div className="grid grid-cols-2 border-b border-gray-300 bg-gray-100">
            {section.Fields?.filter(f => f.Section === "Headings").map((heading) => (
              <React.Fragment key={heading.id}>
                {heading.Values?.map((val, valIdx) => (
                  <div
                    key={valIdx}
                    className="bg-gray-100 border-r border-gray-300 px-4 py-3 font-bold text-gray-700"
                  >
                    {val}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="grid grid-cols-2 bg-white">
            {section.Fields?.map((field) => renderField(field))}
          </div>
        </div>
      </div>
    );
  };



  /**************************************************************************************/
// Form Validation

//   const validateForm = () => {
//   const errors = [];
  
//   // Validate regular fields
//   currentSchema?.Sections?.forEach((section) => {
//     section.Fields?.forEach((field) => {
//       // Skip subsections and headings
//       if (field.Section === "Fields" && field.Type !== "Subsection") {
//         const value = formData[field.id];
        
//         // Check if field is required (you can add a 'Required' property to schema)
//         // For now, checking if any field is empty
//         if (!value || value.toString().trim() === "") {
//           errors.push(`${field.Label} is required`);
//         }
//       }
      
//       // Validate table fields
//       if (field.Section === "Line_Items" && field.Type === "Table") {
//         const rows = tableRows[field.id] || [];
        
//         rows.forEach((row, rowIdx) => {
//           field.Headers?.forEach((header) => {
//             // Skip function type headers (they're calculated)
//             if (header.Type !== "function") {
//               const headerId = header.id || header.Label.replace(/\s+/g, '_').toLowerCase();
//               const key = `${field.id}-${rowIdx}-${headerId}`;
//               const value = formData[key];
              
//               if (header.Type === "number") {
//                 if (value === "" || value === null || value === undefined) {
//                   errors.push(`${field.Label} - Row ${rowIdx + 1}: ${header.Label} is required`);
//                 }
//               } else {
//                 if (!value || value.toString().trim() === "") {
//                   errors.push(`${field.Label} - Row ${rowIdx + 1}: ${header.Label} is required`);
//                 }
//               }
//             }
//           });
//         });
//       }
//     });
//   });
  
//   return errors;
// };

const validateForm = () => {
  const errors = [];
  
  // Get the current status value from formData (it will be 1 or 2)
  const currentStatus = formData['form_ecn_section_rfc_approval_field_status'];
  
  // Validate regular fields
  currentSchema?.Sections?.forEach((section) => {
    section.Fields?.forEach((field) => {
      // Skip subsections and headings
      if (field.Section === "Fields" && field.Type !== "Subsection") {
        const value = formData[field.id];
        
        // Special handling for "Reason for Denial" field
        if (field.id === "form_ecn_section_rfc_approval_field_reason_for_denial") {
          // Only required when status is 1 (Denied)
          if (currentStatus === 1 || currentStatus === "1") {
            if (!value || value.toString().trim() === "") {
              errors.push(`Reason for Denial is required when status is denied`);
            }
          }
          // Skip general validation for this field
          return;
        }
        
        // Skip validation for the Status radio button itself
        if (field.Type === "Radio") {
          return;
        }
        
        // General required check for other fields
        if (!value || value.toString().trim() === "") {
          errors.push(`${field.Label} is required`);
        }
      }
      
      // Validate table fields
      if (field.Section === "Line_Items" && field.Type === "Table") {
        const rows = tableRows[field.id] || [];
        
        rows.forEach((row, rowIdx) => {
          field.Headers?.forEach((header) => {
            // Skip function type headers (they're calculated)
            if (header.Type !== "function") {
              const headerId = header.id || header.Label.replace(/\s+/g, '_').toLowerCase();
              const key = `${field.id}-${rowIdx}-${headerId}`;
              const value = formData[key];
              
              if (header.Type === "number") {
                if (value === "" || value === null || value === undefined) {
                  errors.push(`${field.Label} - Row ${rowIdx + 1}: ${header.Label} is required`);
                }
              } else {
                if (!value || value.toString().trim() === "") {
                  errors.push(`${field.Label} - Row ${rowIdx + 1}: ${header.Label} is required`);
                }
              }
            }
          });
        });
      }
    });
  });
  
  return errors;
};


  /**************************************************************************************/
  // Submit Form 

  // const handleSubmit = async () => {

  //   // Validate form before submission
  // const validationErrors = validateForm();
  
  // if (validationErrors.length > 0) {
  //   // Show first 3 errors to avoid overwhelming the user
  //   validationErrors.slice(0, 3).forEach((error) => {
  //     toast.error(error);
  //   });
    
  //   if (validationErrors.length > 3) {
  //     toast.warning(`And ${validationErrors.length - 3} more errors. Please check all fields.`);
  //   }
    
  //   return; // Stop submission
  // }
  

  //   setLoading(true);
  //   setError(null);
    
  //   // Transform form data into a structured format for Cosmos DB
  //   const formattedData = {
  //     id: `${selectedForm}_${Date.now()}`, // Unique ID for Cosmos DB
  //     formName: selectedForm,
  //     formTitle: currentSchema?.Form,
  //     submittedAt: new Date().toISOString(),
  //     submittedBy: "test@gamil.com",// Replace with actual user ID
  //     status: "submitted",
  //     sections: []
  //   };
    
  //   // Process each section
  //   currentSchema?.Sections?.forEach((section) => {
  //     const sectionData = {
  //       sectionId: section.id,
  //       sectionLabel: section.Label,
  //       fields: [],
  //       tables: []
  //     };
      
  //     // Process regular fields
  //     section.Fields?.forEach((field) => {
  //       if (field.Section === "Fields" && field.Type !== "Subsection") {
  //         sectionData.fields.push({
  //           fieldId: field.id,
  //           fieldLabel: field.Label,
  //           fieldType: field.Type,
  //           value: formData[field.id] || ""
  //         });
  //       }
        
  //       // Process table/line items
  //       if (field.Section === "Line_Items" && field.Type === "Table") {
  //         const tableData = {
  //           tableId: field.id,
  //           tableLabel: field.Label,
  //           headers: field.Headers?.map(h => ({
  //             //id: h.id,
  //             label: h.Label,
  //             type: h.Type
  //           })),
           
  //           rows: []
  //         };

  //   /**************************************************************************/
  //   // Get all rows for this table
  //       tableRows[field.id]?.forEach((row, rowIdx) => {
  //         const rowData = {};
  //         field.Headers?.forEach((header) => {
  //           // Use Label in lowercase as the key for consistency
  //           const headerId = header.Label.toLowerCase().replace(/\s+/g, "_");
  //           const key = `${field.id}-${rowIdx}-${header.id || headerId}`;
  //           const value = formData[key] || "";
  //           //console.log(value)
            
  //           // Convert to appropriate type
  //           if (header.Type === "text") {
  //             rowData[headerId] = value ?? ""
  //           }
  //           else if (header.Type === "number") {
  //             rowData[headerId] = value ? parseFloat(value) : 0;
  //           } else if (header.Type === "function") {
  //             // Calculate function fields (e.g., Total = Qty * Price)
  //             const qtyKey = `${field.id}-${rowIdx}-qty`;
  //             const priceKey = `${field.id}-${rowIdx}-price`;
  //             const qty = parseFloat(formData[qtyKey]) || 0;
  //             const price = parseFloat(formData[priceKey]) || 0;
  //             rowData[headerId] = qty * price;
  //           } else {
  //             rowData[headerId] = 0;
  //           }
  //         });
  //         tableData.rows.push(rowData);
  //       });
        
  //       sectionData.tables.push(tableData);
  //     }
  //   });
    
  //   formattedData.sections.push(sectionData);
  // });
  //   /**************************************************************************/
    
  //   console.log("Formatted submission data:", JSON.stringify(formattedData, null, 2));
  //   //console.log("Formatted submission data:", [formattedData]);
    
  //   try {
  //     const response = await fetch(API.SUBMIT_FORM, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({data:[formattedData]}),
  //     });
  //     //console.log(response)
      
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error('Error response:', errorText);
  //       throw new Error(`Failed to submit form: ${response.status}`);
  //     }
      
  //     const result = await response.json();
  //     console.log("Form submitted successfully:", result);
  //     toast.success("Form submitted successfully!");
      
  //     // Reset form after successful submission
  //     setFormData({});
  //     setTableRows({});
  //     setSelectedForm("");
  //     setCurrentSchema(null);
  //   } catch (err) {
  //     setError('Error submitting form: ' + err.message);
  //     console.error('Error submitting form:', err);
  //    toast.error('Error submitting form. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async () => {

    // Validate form before submission
  const validationErrors = validateForm();
  
  if (validationErrors.length > 0) {
    // Show first 3 errors to avoid overwhelming the user
    validationErrors.slice(0, 3).forEach((error) => {
      toast.error(error);
    });
    
    if (validationErrors.length > 3) {
      toast.warning(`And ${validationErrors.length - 3} more errors. Please check all fields.`);
    }
    
    return; // Stop submission
  }
  
    // Helper function to get label from value for Radio/Dropdown fields
  const getDisplayValue = (field, value) => {
    if ((field.Type === "Radio" || field.Type === "Select") && field.Options) {
      const option = field.Options.find(opt => opt.Value == value);
      return option ? option.Label : value;
    }
    return value;
  };

    setLoading(true);
    setError(null);
    
    // Transform form data into a structured format for Cosmos DB
    const formattedData = {
      id: `${selectedForm}_${Date.now()}`, // Unique ID for Cosmos DB
      formName: selectedForm,
      formTitle: currentSchema?.Form,
      submittedAt: new Date().toISOString(),
      submittedBy: "test@gamil.com",// Replace with actual user ID
      status: "submitted",
      sections: []
    };
    
    // Process each section
    currentSchema?.Sections?.forEach((section) => {
      const sectionData = {
        sectionId: section.id,
        sectionLabel: section.Label,
        fields: [],
        tables: []
      };
      
      // Process regular fields
      section.Fields?.forEach((field) => {
        if (field.Section === "Fields" && field.Type !== "Subsection") {
          const rawValue = formData[field.id] || "";
        const displayValue = getDisplayValue(field, rawValue);
          sectionData.fields.push({
            fieldId: field.id,
            fieldLabel: field.Label,
            fieldType: field.Type,
            // value: formData[field.id] || ""
            value: displayValue
          });
        }
        
        // Process table/line items
        if (field.Section === "Line_Items" && field.Type === "Table") {
          const tableData = {
            tableId: field.id,
            tableLabel: field.Label,
            headers: field.Headers?.map(h => ({
              //id: h.id,
              label: h.Label,
              type: h.Type
            })),
           
            rows: []
          };

    /**************************************************************************/
    // Get all rows for this table
        tableRows[field.id]?.forEach((row, rowIdx) => {
          const rowData = {};
          field.Headers?.forEach((header) => {
            // Use Label in lowercase as the key for consistency
            const headerId = header.Label.toLowerCase().replace(/\s+/g, "_");
            const key = `${field.id}-${rowIdx}-${header.id || headerId}`;
            const value = formData[key] || "";
            //console.log(value)
            
            // Convert to appropriate type
            if (header.Type === "text") {
              rowData[headerId] = value ?? ""
            }
            else if (header.Type === "number") {
              rowData[headerId] = value ? parseFloat(value) : 0;
            }else if (header.Type === "select" || header.Type === "radio") {
              // Get the label instead of numeric value for table dropdowns/radios
              const displayValue = header.Options 
                ? header.Options.find(opt => opt.Value == value)?.Label || value
                : value;
              rowData[headerId] = displayValue; 
            }
            else if (header.Type === "function") {
              // Calculate function fields (e.g., Total = Qty * Price)
              const qtyKey = `${field.id}-${rowIdx}-qty`;
              const priceKey = `${field.id}-${rowIdx}-price`;
              const qty = parseFloat(formData[qtyKey]) || 0;
              const price = parseFloat(formData[priceKey]) || 0;
              rowData[headerId] = qty * price;
            } else {
              rowData[headerId] = 0;
            }
          });
          tableData.rows.push(rowData);
        });
        
        sectionData.tables.push(tableData);
      }
    });
    
    formattedData.sections.push(sectionData);
  });
    /**************************************************************************/
    
    console.log("Formatted submission data:", JSON.stringify(formattedData, null, 2));
    //console.log("Formatted submission data:", [formattedData]);
    
    try {
      const response = await fetch(API.SUBMIT_FORM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data:[formattedData]}),
      });
      //console.log(response)
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to submit form: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Form submitted successfully:", result);
      toast.success("Form submitted successfully!");
      
      // Reset form after successful submission
      setFormData({});
      setTableRows({});
      setSelectedForm("");
      setCurrentSchema(null);
    } catch (err) {
      setError('Error submitting form: ' + err.message);
      console.error('Error submitting form:', err);
     toast.error('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

/**********************************************************************************************************/

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dynamic Form Generator</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <select
          onChange={e => setSelectedForm(e.target.value)}
          value={selectedForm}
          disabled={loading}
          className="border border-gray-300 rounded px-4 py-2 text-lg w-full max-w-md bg-white disabled:bg-gray-100"
        >
          <option value="">Select a form template...</option>
          {schemas.map((schema, index) => (
            <option key={schema.id || schema.Form || index} value={schema.Form || schema.name || schema.id}>
              {schema.Form || schema.name || schema.id}
            </option>
          ))}
        </select>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}
      
      {currentSchema && !loading && (
        <div>
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{currentSchema.Form}</h1>
          </div>
          {currentSchema.Sections?.map((section) => renderSection(section))}
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium text-lg disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

