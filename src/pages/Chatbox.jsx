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
import ReactMarkdown from "react-markdown";
import LogoSetting from "../components/LogoSetting";

const ChatBox = ({role}) => {
  const [model, setModel] = useState("Llama 3.1");
  const [vectorizer, setVectorizer] = useState("nomic-embed-text");
  const [question, setQuestion] = useState("");

  const [responses, setResponses] = useState([]);

  const [displayedText, setDisplayedText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleModelChange = (event) => setModel(event.target.value);
  const handleVectorizerChange = (event) => setVectorizer(event.target.value);

  const handleSend = () => {
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");

    const placeholder = {
      user: currentQuestion,
      bot: "⌛",
      source: [],
    };
    setResponses((prev) => [...prev, placeholder]);

    const payload = {
      id: "17",
      embedding_model: vectorizer,
      llm_model: model,
      question: currentQuestion,
    };

    chatPersonal(payload).then((res) => {
      const updatedEntry = {
        user: currentQuestion,
        bot: res.response,
        source: res.sources || [],
      };

      setResponses((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = updatedEntry;
        return updated;
      });
    });
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
      }, 10);

      return () => clearInterval(typingInterval);
    }
  }, [responses]);

  return (
    <Grid
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
      }}
      direction={"column"}
      justifyContent="spavce-between"
    >
      {responses.length === 0 && (
        <Grid item xs sx={{ textAlign: "center", pt: 10 }}>
          <img
            src={ChatbotImage}
            alt="Chatbot"
            style={{ maxWidth: "127px", height: "120px" }}
          />
          <Typography variant="h4" sx={{ color: "#757575", mt: 2 }}>
            Halo, {role}!
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
        <Grid
          sx={{
            flex: 1,
            overflowY: "auto",
            mx: "auto",
            height: "80%",
            pt: 10,
            border:'1px solid black',
          }}
          ref={chatEndRef}
        >
          {responses?.map((res, idx) => (
            <Box
              key={idx}
              sx={{
                mx: "auto",
                mb: 4,
                px: 1,
                maxWidth: responses.length > 0 ? "70%" : "80%",
              }}
            >
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

              <Box sx={{ display: "flex", alignItems: "flex-start", my: 6 }}>
                <Box
                  component="img"
                  src={ChatbotImage}
                  alt="Bot Avatar"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box>
                  <Box sx={{ mb: 1, typography: "body1", textAlign: "start" }}>
                    {res.bot === "⌛" ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            display: "inline-block",
                            fontSize: "1.2rem",
                            animation: "spin 1s linear infinite",
                            "@keyframes spin": {
                              from: { transform: "rotate(0deg)" },
                              to: { transform: "rotate(360deg)" },
                            },
                          }}
                        >
                          ⌛
                        </Box>
                        <Typography>Thinking...</Typography>
                      </Box>
                    ) : (
                      <ReactMarkdown>
                        {idx === responses.length - 1 ? displayedText : res.bot}
                      </ReactMarkdown>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "start" }}>
                    {res.source.length > 0 && (
                      <Box sx={{ display: "flex", alignItems: "start", mt: 2 }}>
                        <Typography sx={{ fontWeight: 500, mr: 1 }}>
                          Source :
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {res.source.map((src, i) => (
                            <Box
                              key={i}
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
                              <Typography align="start">📄 {src}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      <Grid
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

            <FormControl
              sx={{ m: 1, minWidth: 320, textAlign: "start" }}
              size="small"
            >
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
                <MenuItem value="nomic-embed-text">nomic-embed-text</MenuItem>
                <MenuItem value="paraphrase-ultilingual-mpnet-base-v2">
                  paraphrase-ultilingual-mpnet-base-v2
                </MenuItem>
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
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{
                m: 1,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "#f5f5f5",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
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
      </Grid>
    </Grid>
  );
};

export default ChatBox;
