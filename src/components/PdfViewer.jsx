import React, { useEffect, useRef, useState } from "react";
import {
  getArrayBufferPDFDepartment,
  getArrayBufferPDFPersonal,
} from "../services";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { scrollbar } from "../utils/scrollbar";
import ClearIcon from "@mui/icons-material/Clear";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const PdfViewer = ({ id, source, type, setIsViewPdf, selected, dept_id }) => {
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

  // useEffect(() => {
  //   const fetchPdf = async () => {
  //     try {
  //       setIsLoading(true);

  //       if (type === "Personal") {
  //         console.log("masuk");
  //         const response = await getArrayBufferPDFPersonal({
  //           user_id: id,
  //           filename: filenamePart + ".pdf",
  //           page: pageNumber,
  //         });

  //         const blob = new Blob([response], { type: "application/pdf" });
  //         const url = URL.createObjectURL(blob);
  //         setBlobUrl(url);

  //         const loadingTask = pdfjsLib.getDocument({
  //           url: url,
  //           cMapUrl: "https://unpkg.com/pdfjs-dist/cmaps/",
  //           cMapPacked: true,
  //         });

  //         const pdf = await loadingTask.promise;
  //         setPdfInstance(pdf);
  //       } else {
  //         console.log("masuk dept");
  //         const response = await getArrayBufferPDFDepartment({
  //           dept_id: dept_id,
  //           filename: filenamePart + ".pdf",
  //           page: pageNumber,
  //         });

  //         const blob = new Blob([response], { type: "application/pdf" });
  //         const url = URL.createObjectURL(blob);
  //         setBlobUrl(url);

  //         const loadingTask = pdfjsLib.getDocument({
  //           url: url,
  //           cMapUrl: "https://unpkg.com/pdfjs-dist/cmaps/",
  //           cMapPacked: true,
  //         });

  //         const pdf = await loadingTask.promise;
  //         setPdfInstance(pdf);
  //       }
  //     } catch (err) {
  //       setError("Failed to load PDF");
  //       console.error("Error fetching PDF:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (source) fetchPdf();

  //   return () => {
  //     if (blobUrl) {
  //       URL.revokeObjectURL(blobUrl);
  //     }
  //   };
  // }, [source, id]);
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setIsLoading(true);
        const isMobile = window.innerWidth < 600;
        let response;

        const filename = filenamePart + ".pdf";

        if (type === "Personal") {
          console.log("masuk personal");
          response = await getArrayBufferPDFPersonal({
            user_id: id,
            filename,
            page: pageNumber,
          });
        } else {
          console.log("masuk dept");
          response = await getArrayBufferPDFDepartment({
            dept_id,
            filename,
            page: pageNumber,
          });
        }

        const blob = new Blob([response], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        if (isMobile) {
          window.open(url, "_blank");
          setIsViewPdf(false)
          return;
        }

        setBlobUrl(url);

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: "https://unpkg.com/pdfjs-dist/cmaps/",
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        setPdfInstance(pdf);
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
      {isLoading ? (
        // Kalau masih loading, tampilkan spinner
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <CircularProgress />
          <Typography variant="body2" mt={2}>
            Memuat PDF...
          </Typography>
        </Stack>
      ) : (
        <>
          <Stack width={"100%"} alignItems={"center"}>
            <Stack
              direction="row"
              justifyContent="end"
              position={"absolute"}
              right={0}
              top={5}
              paddingRight={2}
            >
              <IconButton
                aria-label="close"
                size="small"
                onClick={() => setIsViewPdf(false)}
                sx={{
                  border: "1px solid grey",
                  backgroundColor: "grey.200",
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "grey.300",
                  },
                }}
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </Stack>

            <div style={{ maxWidth: "100%" }}>
              <canvas ref={canvasRef} />
            </div>
          </Stack>

          <Stack
            direction={"row"}
            justifyContent={"center"}
            spacing={2}
            position={"absolute"}
            bottom={0}
            sx={{ paddingBottom: 2 }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleZoomIn}
              sx={{ textTransform: "none", backgroundColor: "black" }}
            >
              Zoom In
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleZoomOut}
              sx={{ textTransform: "none", backgroundColor: "black" }}
            >
              Zoom Out
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default PdfViewer;
