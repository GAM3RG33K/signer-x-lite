import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './SignaturePad.css'; // Create a CSS file for styling

const SignaturePad = ({ onSave }) => {
  const sigPadRef = useRef();
  const [strokes, setStrokes] = useState([]);

  // Save the signature
  const handleSave = () => {
    if (sigPadRef.current.isEmpty()) {
      alert('Please provide a signature before saving.');
      return;
    }
    const signatureImage = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
    onSave(signatureImage);
  };

  // Clear the signature pad
  const handleClear = () => {
    sigPadRef.current.clear();
    setStrokes([]);
  };

  // Undo the last stroke
  const handleUndo = () => {
    if (strokes.length === 0) return;

    const newStrokes = [...strokes];
    newStrokes.pop();
    setStrokes(newStrokes);
    sigPadRef.current.fromData(newStrokes);
  };

  // Track the strokes
  const handleEndStroke = () => {
    const currentStrokes = sigPadRef.current.toData();
    setStrokes(currentStrokes);
  };

  return (
    <div className="signature-pad-container">
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        onEnd={handleEndStroke}
        canvasProps={{
          width: 400,
          height: 200,
          className: 'signature-canvas', // CSS class for styling
        }}
      />
      <div className="signature-pad-buttons">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleSave}>Save Signature</button>
      </div>
    </div>
  );
};

export default SignaturePad;
