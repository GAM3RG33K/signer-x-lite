import React, { useState } from 'react';
import UploadPDF from '../components/UploadPDF';
import PDFEditor from '../components/PDFEditor';
import SignaturePad from '../components/SignaturePad';

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [annotatedPdf, setAnnotatedPdf] = useState(null);

  return (
    <div>
      <h1>PDF Signer</h1>
      <UploadPDF onUpload={(files) => setPdfFile(files[0]?.file)} />
      {pdfFile && <SignaturePad onSave={(signatureImage) => setSignature(signatureImage)} />}
      {pdfFile && signature && (
        <PDFEditor
          pdfFile={pdfFile}
          signature={signature}
          onComplete={(annotatedPdf) => setAnnotatedPdf(annotatedPdf)}
        />
      )}
      {annotatedPdf && (
        <a href={URL.createObjectURL(annotatedPdf)} download="signed_document.pdf">
          Download Annotated PDF
        </a>
      )}
    </div>
  );
};

export default Home;
