import React, { useEffect, useRef, useState } from "react";
import { getArrayBufferPDFDepartment, getArrayBufferPDFPersonal } from "../services";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
import { Stack } from "@mui/material";
import { scrollbar } from "../utils/scrollbar";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const PdfViewer = ({ id, source, type, setIsViewPdf, selected, dept_id}) => {
  const [scale, setScale] = useState(1);
  const [blobUrl, setBlobUrl] = useState("");
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [pageRendering, setPageRendering] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  const [filenamePart, pagePart] = source.split(/\.pdf:|:/);
  const pageNumber = parseInt(pagePart, 10);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setIsLoading(true);

        if (type === "Personal") {
          console.log("masuk")
          const response = await getArrayBufferPDFPersonal({
            user_id: id,
            filename: filenamePart + ".pdf",
            page: pageNumber,
          });

          const blob = new Blob([response], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);

          const loadingTask = pdfjsLib.getDocument({
            url: url,
            cMapUrl: "https://unpkg.com/pdfjs-dist/cmaps/",
            cMapPacked: true,
          });

          const pdf = await loadingTask.promise;
          setPdfInstance(pdf);
        } else {
          console.log("masuk dept")
          const response = await getArrayBufferPDFDepartment({
            dept_id: dept_id,
            filename: filenamePart + ".pdf",
            page: pageNumber,
          });

          const blob = new Blob([response], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);

          const loadingTask = pdfjsLib.getDocument({
            url: url,
            cMapUrl: "https://unpkg.com/pdfjs-dist/cmaps/",
            cMapPacked: true,
          });

          const pdf = await loadingTask.promise;
          setPdfInstance(pdf);
        }
      } catch (err) {
        setError("Failed to load PDF");
        console.error("Error fetching PDF:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (source) fetchPdf();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [source, id]);

  // Load the page once when PDF is loaded
  useEffect(() => {
    const loadPage = async () => {
      if (!pdfInstance) return;
      try {
        const page = await pdfInstance.getPage(1);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error loading page:", err);
        setError("Failed to load PDF page");
      }
    };

    loadPage();
  }, [pdfInstance]);

  // Render page when either the page or scale changes
  useEffect(() => {
    const renderPage = async () => {
      if (!currentPage || !canvasRef.current) return;

      try {
        setPageRendering(true);

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Clear previous rendering
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Create viewport with current scale
        const viewport = currentPage.getViewport({ scale });

        // Update canvas dimensions to match the viewport
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await currentPage.render(renderContext).promise;
        setPageRendering(false);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError("Failed to render PDF");
        setPageRendering(false);
      }
    };

    renderPage();
  }, [currentPage, scale]);

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.25);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.5, prevScale - 0.25));
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={2}
      paddingY={3}
      paddingX={0}
      height={"93vh"}
      backgroundColor="white"
      boxShadow={"5px 0px 10px rgba(0, 0, 0, 0.15)"}
      sx={{ ...scrollbar("#9E9E9E"), overflowX: "auto", overflowY: "auto" }}
    >
      {isLoading && <p>Loading PDF...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {pageRendering && <p>Rendering PDF...</p>}

      <Stack width={"100%"} spacing={2} sx={{ alignItems: "center" }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
          <button onClick={() => setIsViewPdf(false)}>x</button>
        </Stack>
        <div style={{ maxWidth: "100%", overflow: "auto" }}>
          <canvas ref={canvasRef} />
        </div>
      </Stack>

      <p>Zoom Level: {scale.toFixed(2)}x</p>
    </Stack>
  );
};

export default PdfViewer;
