import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.mjs`;


const PDFEditor = ({ pdfFile, signature, onComplete }) => {
  const [numPages, setNumPages] = useState(null);
  const [text, setText] = useState('');

  const loadPdf = async () => {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    if (signature) {
      const pngImage = await pdfDoc.embedPng(signature);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawImage(pngImage, {
        x: 100,
        y: 150,
        width: 100,
        height: 50,
      });
    }

    if (text) {
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawText(text, { x: 50, y: 600 });
    }

    const newPdfBytes = await pdfDoc.save();
    onComplete(new Blob([newPdfBytes], { type: 'application/pdf' }));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Text to add to PDF"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={loadPdf}>Add Text & Signature</button>
      </div>
      <Document file={pdfFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};

export default PDFEditor;
