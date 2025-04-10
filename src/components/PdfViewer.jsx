import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
import ShowdPDF from "../assets/pdf/pdfdummy.pdf";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const PdfViewer = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useEffect(() => {
    const renderPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(ShowdPDF);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const containerWidth = containerRef.current.clientWidth;
      const scale = containerWidth / page.getViewport({ scale: 1 }).width;

      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      context.fillStyle = "#D8DAE5";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      setPdfLoaded(true);
    };

    renderPDF();

    // Optional: Re-render on resize
    window.addEventListener("resize", renderPDF);
    return () => window.removeEventListener("resize", renderPDF);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "auto", 
          display: "block",
        }}
      />
      {!pdfLoaded && <p>Loading PDF...</p>}
    </div>
  );
};

export default PdfViewer;
