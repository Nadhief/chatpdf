import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  OutlinedInput,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import ChatbotImage from "../assets/images/Chatbot.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { chatPersonal } from "../services";
const Chatpdf = () => {
  const [model, setModel] = useState("Llama 3.1");
  const [vectorizer, setVectorizer] = useState(
    "paraphrase-ultilingual-mpnet-base-v2"
  );
  const [question, setQuestion] = useState("");

  const [responses, setResponses] = useState([]);

  const [displayedText, setDisplayedText] = useState("");

  const handleModelChange = (event) => setModel(event.target.value);
  const handleVectorizerChange = (event) => setVectorizer(event.target.value);

  const handleSend = () => {
    if (!question) return;
    console.log(question);
    const payload = {
      id: "17",
      embedding_model: "nomic-embed-text",
      llm_model: model,
      question: question,
    };
    chatPersonal(payload).then((res) => {
      console.log(res);
    });
    setResponses([...responses, newMessage]);
    setQuestion("");
  };

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  useEffect(() => {
    if (responses.length > 0) {
      const lastResponse = responses[responses.length - 1];
      const fullText = lastResponse.bot;

      let index = 0;
      setDisplayedText("");

      const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;

        if (index === fullText.length) {
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [responses]);

  return (
    <Grid
      sx={{ height: "85vh" }}
      direction={"column"}
      justifyContent="spavce-between"
    >
      {responses.length === 0 && (
        <Grid item xs>
          <img
            src={ChatbotImage}
            alt="Chatbot"
            style={{ maxWidth: "127px", height: "120px" }}
          />
          <Typography variant="h4" sx={{ color: "#757575", mt: 2 }}>
            Halo, User!
          </Typography>
          <Typography variant="h2" sx={{ my: 2 }}>
            How may I help you?
          </Typography>
          <Grid sx={{ color: "#757575" }}>
            <Typography variant="subtitle1">
              Ready to assist with anything you need?
            </Typography>
            <Typography>
              Answering question and summarizing from any document.
            </Typography>
            <Typography>Let's get started!</Typography>
          </Grid>
        </Grid>
      )}

      {responses.length > 0 && (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            maxWidth: responses.length > 0 ? "70%" : "80%",
            mx: "auto",
            height: "90%",
          }}
          ref={chatEndRef}
        >
          {responses.map((res, idx) => (
            <Box key={idx} sx={{ mb: 4, px: 1 }}>
              {/* Chat dari user */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    px: 2,
                    py: 1,
                    maxWidth: "60%",
                  }}
                >
                  <Typography textAlign={"start"}>{res.user}</Typography>
                </Box>
              </Box>

              {/* Respon dari bot */}
              <Box sx={{ display: "flex", alignItems: "flex-start", my: 6 }}>
                <Box
                  component="img"
                  src={ChatbotImage}
                  alt="Bot Avatar"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box>
                  <Typography textAlign={"start"} sx={{ mb: 1 }}>
                    {idx === responses.length - 1 ? displayedText : res.bot}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 500, mr: 1 }}>
                      Source :
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "20px",
                        px: 2,
                        py: 0.5,
                        fontSize: "0.9rem",
                        color: "#666",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      📄 File PDF
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box
        sx={{
          position: responses.length > 0 ? "sticky" : "static",
          bottom: 0,
          zIndex: 10,
          maxWidth: responses.length > 0 ? "70%" : "80%",
          mx: "auto",
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          direction="column"
          sx={{ mt: responses.length > 0 ? 0 : 10 }}
        >
          <Grid container justifyContent="flex-end">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="model-label">Model</InputLabel>
              <Select
                labelId="model-label"
                id="select-model"
                label="Model"
                value={model}
                onChange={handleModelChange}
                input={
                  <OutlinedInput label="Model" sx={{ borderRadius: "20px" }} />
                }
              >
                <MenuItem value="Llama 3.1">Llama 3.1</MenuItem>
                <MenuItem value="Mistral">Mistral</MenuItem>
                <MenuItem value="Deepseek-r1:7b">Deepseek-r1:7b</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 320 }} size="small">
              <InputLabel id="vector-label">Vektorisasi</InputLabel>
              <Select
                labelId="vector-label"
                id="select-vector"
                label="Vektorisasi"
                value={vectorizer}
                onChange={handleVectorizerChange}
                input={
                  <OutlinedInput
                    label="Vektorisasi"
                    sx={{ borderRadius: "20px" }}
                  />
                }
              >
                <MenuItem value="paraphrase-ultilingual-mpnet-base-v2">
                  paraphrase-ultilingual-mpnet-base-v2
                </MenuItem>
                <MenuItem value="nomic-embed-text">nomic-embed-text</MenuItem>
                <MenuItem value="all-mpnet-base-v2">all-mpnet-base-v2</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid container item width="100%">
            <TextField
              placeholder="Ask any question..."
              size="small"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              multiline
              maxRows={8}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Biar nggak bikin newline
                  handleSend();
                }
              }}
              sx={{ m: 1, width: "100%" }}
              InputProps={{
                sx: {
                  borderRadius: "20px",
                  backgroundColor: "#f5f5f5",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSend}
                      sx={{
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#EA001E",
                        },
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                      }}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Chatpdf;
