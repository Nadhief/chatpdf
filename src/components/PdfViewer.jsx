import React, { useEffect, useRef, useState } from "react";
import { getArrayBufferPDFPersonal } from "../services";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();
const PdfViewer = ({id, source}) => {
  const [blobUrl, setBlobUrl] = useState("");
  const [filenamePart, pagePart, questionPart] = source.split(/\.pdf:|:/);
  const pageNumber = parseInt(pagePart, 10) + 1;
  console.log(filenamePart, pagePart)
  const canvasRef = useRef();
  const [error, setError] = useState(null);

  const fetchPdf = async () => {
    try {
      const res = await getArrayBufferPDFPersonal({
        user_id: "17",
        filename: "2014 ARA_PJT1 Webb"+".pdf",
        page: pageNumber,
      });
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch (err) {
      console.error("Error fetching PDF:", err);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, [source]);

  return (
    <>
      {blobUrl ? (
        <iframe
          src={blobUrl}
          title="PDF Viewer"
          width="100%"
          height="1000px"
          style={{ border: "none", backgroundColor: "#D8DAE5" }}
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </>
  );
};

export default PdfViewer;
