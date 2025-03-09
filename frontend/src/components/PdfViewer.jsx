import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function PdfViewer() {
  const location = useLocation();
  const { pdfUrl } = location.state || {};
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    if (pdfUrl) {
      // Test if the PDF URL is accessible
      fetch(pdfUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to load PDF');
          }
        })
        .catch((error) => {
          setPdfError(error.message);
        });
    }
  }, [pdfUrl]);

  if (!pdfUrl) {
    return <div className="text-center mt-10 text-red-500">No PDF URL provided. Please upload a file first.</div>;
  }

  if (pdfError) {
    return <div className="text-center mt-10 text-red-500">Error: {pdfError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Transcript PDF</h2>
      <iframe
        src={pdfUrl}
        width="100%"
        height="600px"
        title="PDF Transcript"
        className="border border-gray-300 rounded"
        onError={() => setPdfError("Failed to display PDF. It may not exist or is inaccessible.")}
      />
      <div className="mt-4 text-center">
        <a
          href={pdfUrl}
          download
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}

export default PdfViewer;