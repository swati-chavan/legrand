import React from 'react';

const RecordViewer = ({ record, onClose, onEdit}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-5 overflow-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-800">
            {record.formTitle}
          </h2>
          <div className="flex gap-3">
          <button
              onClick={onEdit} // ← NEW: Edit button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-medium shadow-md"
            >
              Edit
            </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium shadow-md"
          >
           ✕ Close
          </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <span className="font-semibold text-gray-700">ID:</span>{' '}
            <span className="text-gray-900 break-all">{record._id}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Form Name:</span>{' '}
            <span className="text-gray-900">{record.formName}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Submitted By:</span>{' '}
            <span className="text-gray-900">{record.submittedBy}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Status:</span>{' '}
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
              record.status === 'submitted' ? 'bg-yellow-500 text-white' : 
              record.status === 'approved' ? 'bg-green-500 text-white' : 
              'bg-red-500 text-white'
            }`}>
              {record.status}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Submitted At:</span>{' '}
            <span className="text-gray-900">
              {new Date(record.submittedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sections */}
        {record.sections?.map((section, sectionIdx) => (
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
                    <div className="font-semibold text-gray-800 mb-1">
                      {field.fieldLabel}:
                    </div>
                    <div className="text-gray-900">
                      {field.value || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tables */}
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
                          {Object.entries(row).map(([key, value], cellIdx) => (
                            <td 
                              key={cellIdx} 
                              className="px-6 py-4 text-sm text-gray-800 border border-gray-300"
                            >
                              {value ?? 'N/A'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordViewer;
