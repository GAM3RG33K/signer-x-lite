import React, { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { PDF_WORKER_PATH } from "../App"; // Import PDF_WORKER_PATH

const PDFEditor = ({ pdfFile, signature, onComplete }) => {
  const [numPages, setNumPages] = useState(null);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({
    xPercent: 0.1,
    yPercent: 0.1,
    widthPercent: 0.2,
  });
  const [signaturePosition, setSignaturePosition] = useState({
    xPercent: 0.2,
    yPercent: 0.2,
    widthPercent: 0.2,
  });
  const [pageDimensions, setPageDimensions] = useState({
    width: 600,
    height: 800,
  });
  const pdfViewerRef = useRef();

  // Use effect to set the workerSrc after the component mounts
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_PATH;
  }, []);

  const loadPdf = async () => {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

    // Convert relative positions to actual positions on the PDF
    const textX = textPosition.xPercent * pdfWidth;
    const textY = pdfHeight - textPosition.yPercent * pdfHeight;
    const textWidth = textPosition.widthPercent * pdfWidth;

    const signatureX = signaturePosition.xPercent * pdfWidth;
    const signatureY =
      pdfHeight -
      signaturePosition.yPercent * pdfHeight -
      signaturePosition.widthPercent * pdfWidth * 0.5; // Adjust height accordingly
    const signatureWidth = signaturePosition.widthPercent * pdfWidth;
    const signatureHeight = signatureWidth * 0.5; // Assuming a fixed aspect ratio of width:height = 2:1

    // Add text to the PDF at user-defined position
    if (text) {
      firstPage.drawText(text, {
        x: textX,
        y: textY,
        maxWidth: textWidth,
      });
    }

    // Add signature to the PDF at user-defined position
    if (signature) {
      const pngImage = await pdfDoc.embedPng(signature);
      firstPage.drawImage(pngImage, {
        x: signatureX,
        y: signatureY,
        width: signatureWidth,
        height: signatureHeight,
      });
    }

    const newPdfBytes = await pdfDoc.save();
    onComplete(new Blob([newPdfBytes], { type: "application/pdf" }));
  };

  const handleDragStop = (type, d) => {
    // Update the position as a percentage of the page dimensions
    const xPercent = d.x / pageDimensions.width;
    const yPercent = d.y / pageDimensions.height;

    if (type === "text") {
      setTextPosition((prev) => ({ ...prev, xPercent, yPercent }));
    } else if (type === "signature") {
      setSignaturePosition((prev) => ({ ...prev, xPercent, yPercent }));
    }
  };

  const handleResizeStop = (type, e, direction, ref, d) => {
    // Update the width as a percentage of the page dimensions
    const widthPercent = ref.offsetWidth / pageDimensions.width;

    if (type === "text") {
      setTextPosition((prev) => ({ ...prev, widthPercent }));
    } else if (type === "signature") {
      setSignaturePosition((prev) => ({ ...prev, widthPercent }));
    }
  };

  const handlePageLoadSuccess = (page) => {
    setPageDimensions({ width: page.width, height: page.height });
  };

  return (
    <div
      style={{ position: "relative", width: "fit-content", margin: "0 auto" }}
    >
      <div>
        <input
          type="text"
          placeholder="Text to add to PDF"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div style={{ position: "relative" }}>
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          ref={pdfViewerRef}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={600} // Set width of rendered page
              onLoadSuccess={handlePageLoadSuccess}
            />
          ))}
        </Document>

        {/* Text draggable component */}
        {text && (
          <Rnd
            size={{
              width: textPosition.widthPercent * pageDimensions.width,
              height: "auto",
            }}
            position={{
              x: textPosition.xPercent * pageDimensions.width,
              y: textPosition.yPercent * pageDimensions.height,
            }}
            onDragStop={(e, d) => handleDragStop("text", d)}
            onResizeStop={(e, direction, ref, delta, position) =>
              handleResizeStop("text", e, direction, ref, delta)
            }
            bounds="parent"
            style={{
              position: "absolute",
              background: "rgba(255, 255, 0, 0.5)",
              padding: "5px",
              cursor: "move",
            }}
          >
            <div>{text}</div>
          </Rnd>
        )}

        {/* Signature draggable component */}
        {signature && (
          <Rnd
            size={{
              width: signaturePosition.widthPercent * pageDimensions.width,
              height:
                signaturePosition.widthPercent * pageDimensions.width * 0.5, // Assuming a 2:1 aspect ratio
            }}
            position={{
              x: signaturePosition.xPercent * pageDimensions.width,
              y: signaturePosition.yPercent * pageDimensions.height,
            }}
            onDragStop={(e, d) => handleDragStop("signature", d)}
            onResizeStop={(e, direction, ref, delta, position) =>
              handleResizeStop("signature", e, direction, ref, delta)
            }
            bounds="parent"
            style={{
              position: "absolute",
              cursor: "move",
            }}
          >
            <img
              src={signature}
              alt="Signature"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                border: "2px solid black",
              }}
            />
          </Rnd>
        )}
      </div>

      <button onClick={loadPdf}>Add Text & Signature to PDF</button>
    </div>
  );
};

export default PDFEditor;
