import React, { use, useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
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
  Stack,
} from "@mui/material";
import ChatbotImage from "../assets/images/Chatbot.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  chatDepartemen,
  chatPersonal,
  chatPersonalAnalyst,
  chatTopic,
  getChatByHistoryId,
  getChatDataByHistoryId,
} from "../services";
import ReactMarkdown from "react-markdown";
import LogoSetting from "../components/LogoSetting";
import { set } from "lodash";

const ChatBoxanalyst = ({
  role,
  id,
  selected,
  responseSummarize,
  setResponseSummarize,
  isSummarize,
  setIsSummarize,
  selectedTopic,
  topicName,
  deptID,
  setIsViewPdf,
  setPdfSource,
  setType,
  model,
  setModel,
  vectorizer,
  setVectorizer,
  toggleSidebar,
  isViewPdf,
  isHistory,
  newChat,
  historyId,
  setHistoryId,
  isAnalyst,
  setIsAnalyst,
}) => {
  // const [model, setModel] = useState("Llama 3.1");
  // const [vectorizer, setVectorizer] = useState("nomic-embed-text");
  const [question, setQuestion] = useState("");

  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem("chat_responses");
    return saved ? JSON.parse(saved) : [];
  });

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
      type: "",
    };
    setResponses((prev) => [...prev, placeholder]);
    if (historyId) {
      const payload = {
        id: String(id),
        embedding_model: vectorizer,
        llm_model: model,
        history_id: String(historyId),
        question: currentQuestion,
      };
      if (isAnalyst === true) {
        const payloadAnalyst = {
          id: String(id),
          database_name: topicName,
          question: currentQuestion,
          history_id: String(historyId),
        };
        console.log("masuk pak eko", payloadAnalyst);
        chatPersonalAnalyst(payloadAnalyst)
          .then((res) => {
            setHistoryId(res.current_history_id);
            console.log(res);
            const updatedEntry = {
              user: currentQuestion,
              bot: res.response.output,
              // source: filenames,
              // type: res.type,
              // bot_chart: res.response_chart,
            };
            console.log("updatedEntry", updatedEntry);
            setResponses((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = updatedEntry;
              return updated;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (selectedTopic === true) {
          const payloadTopic = {
            id: String(id),
            embedding_model: vectorizer,
            llm_model: model,
            question: currentQuestion,
            topic: topicName,
            history_id: String(historyId),
          };
          chatTopic(payloadTopic).then((res) => {
            const filenames = res?.sources?.map((item) => {
              return item;
            });

            const updatedEntry = {
              user: currentQuestion,
              bot: res.response,
              source: filenames,
              type: res.type,
              bot_chart: res.response_chart,
            };

            console.log("updatedEntry", updatedEntry);

            setResponses((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = updatedEntry;
              return updated;
            });
          });
        } else {
          if (selected === "personal") {
            chatPersonal(payload).then((res) => {
              const filenames = res?.sources?.map((item) => {
                return item;
              });

              const updatedEntry = {
                user: currentQuestion,
                bot: res.response,
                source: filenames,
                type: res.type,
                bot_chart: res.response_chart,
              };
              console.log("updatedEntry", updatedEntry);

              setResponses((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = updatedEntry;
                return updated;
              });
            });
          } else if (selected === "departemen") {
            const payloadDepartment = {
              id: String(deptID),
              embedding_model: vectorizer,
              llm_model: model,
              question: currentQuestion,
              history_id: String(historyId),
            };
            chatDepartemen(payloadDepartment).then((res) => {
              const filenames = res?.sources?.map((item) => {
                return item;
              });

              const updatedEntry = {
                user: currentQuestion,
                bot: res.response,
                source: filenames,
                type: res.type,
                bot_chart: res.response_chart,
              };
              console.log("updatedEntry", updatedEntry);

              setResponses((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = updatedEntry;
                return updated;
              });
            });
          }
        }
      }
    } else {
      const payload = {
        id: String(id),
        embedding_model: vectorizer,
        llm_model: model,
        history_id: "",
        question: currentQuestion,
      };
      if (isAnalyst === true) {
        const payloadAnalyst = {
          id: String(id),
          database_name: topicName,
          question: currentQuestion,
          history_id: "",
        };
        console.log("masuk pak eko", payloadAnalyst);
        chatPersonalAnalyst(payloadAnalyst)
          .then((res) => {
            setHistoryId(res.current_history_id);
            console.log(res);
            const updatedEntry = {
              user: currentQuestion,
              bot: res.response.output,
              // source: filenames,
              // type: res.type,
              // bot_chart: res.response_chart,
            };
            console.log("updatedEntry", updatedEntry);
            setResponses((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = updatedEntry;
              return updated;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (selectedTopic === true) {
          const payloadTopic = {
            id: String(id),
            embedding_model: vectorizer,
            llm_model: model,
            question: currentQuestion,
            topic: topicName,
            history_id: "",
          };
          chatTopic(payloadTopic).then((res) => {
            setHistoryId(res?.current_history_id);
            const filenames = res?.sources?.map((item) => {
              const cleanedItem = item.replace(/^PDF:\s*/, "");
              return cleanedItem.split("/").pop();
            });

            const updatedEntry = {
              user: currentQuestion,
              bot: res.response,
              source: filenames,
              type: res.type,
              bot_chart: res.response_chart,
            };

            console.log("updatedEntry", updatedEntry);

            setResponses((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = updatedEntry;
              return updated;
            });
          });
        } else {
          if (selected === "personal") {
            chatPersonal(payload).then((res) => {
              setHistoryId(res?.current_history_id);
              const filenames = res?.sources?.map((item) => {
                const cleanedItem = item.replace(/^PDF:\s*/, "");
                return cleanedItem.split("/").pop();
              });

              const updatedEntry = {
                user: currentQuestion,
                bot: res.response,
                source: filenames,
                type: res.type,
                bot_chart: res.response_chart,
              };

              console.log("updatedEntry", updatedEntry);

              setResponses((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = updatedEntry;
                return updated;
              });
            });
          } else if (selected === "departemen") {
            const payloadDepartment = {
              id: String(deptID),
              embedding_model: vectorizer,
              llm_model: model,
              question: currentQuestion,
              history_id: "",
            };
            chatDepartemen(payloadDepartment).then((res) => {
              setHistoryId(res?.current_history_id);
              const filenames = res?.sources?.map((item) => {
                return item;
              });

              const updatedEntry = {
                user: currentQuestion,
                bot: res.response,
                source: filenames,
                type: res.type,
                bot_chart: res.response_chart,
              };
              console.log("updatedEntry", updatedEntry);

              setResponses((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = updatedEntry;
                return updated;
              });
            });
          }
        }
      }
    }
  };
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

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

  useEffect(() => {
    localStorage.setItem("chat_responses", JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    if (isSummarize) {
      const placeholder = {
        user: "Please summarize this document",
        bot: "⌛",
        source: [],
      };
      setResponses((prev) => [...prev, placeholder]);
      setIsSummarize(false);
    }
  }, [isSummarize]);

  useEffect(() => {
    if (responseSummarize) {
      console.log(responseSummarize);
      const filenames = responseSummarize?.sources?.map((item) => {
        return item;
      });

      const updatedEntry = {
        user: "Please summarize this document",
        bot: responseSummarize?.response,
        source: filenames,
        type: responseSummarize?.type,
        bot_chart: [],
      };

      console.log("updatedEntry", updatedEntry);

      setResponses((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = updatedEntry;
        return updated;
      });
      setIsSummarize(false);
      setResponseSummarize(null);
    }
  }, [responseSummarize, isSummarize]);

  useEffect(() => {
    if (newChat) {
      setResponses([]);
      setIsSummarize(false);
      setResponseSummarize(null);
      setQuestion("");
      setDisplayedText("");
    }
  }, [newChat]);

  useEffect(() => {
    if (historyId) {
      const payload = {
        history_id: String(historyId),
      };

      getChatDataByHistoryId(payload)
        .then((res) => {
          console.log(res)
          const pairedChats = [];
          for (let i = 0; i < res.length; i += 2) {
            const humanItem = res[i];
            const aiItem = res[i + 1];

            pairedChats.push({
              user: humanItem?.content || "",
              bot: aiItem?.content || "",
            });
          }
          console.log("pairedChats", pairedChats);
          setResponses(pairedChats);
        })
        .catch((error) => {
          console.error("Gagal memuat chat:", error);
          setResponses([]);
        });
    }
  }, [historyId]);
  // console.log(responses);
  return (
    <Stack
      sx={{
        height: "95vh",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "100%",
        position: "relative",
      }}
      direction={"column"}
      justifyContent="spavce-between"
    >
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 100,
          display: { xs: "flex", sm: "flex", md: "flex", lg: "none" },
          backgroundColor: "#f0f0f0",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
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
            How may I help you? analyst
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
        <Stack
          sx={{
            flex: 1,
            overflowY: "auto",
            height: "80%",
            pt: 5,
          }}
        >
          {responses?.map((res, idx) => (
            <Stack
              key={idx}
              sx={{
                mx: {
                  xs: 0,
                  md: "auto",
                },
                mb: 4,
                px: 1,
                maxWidth: {
                  xs: "100%",
                  md: responses.length > 0 ? "80%" : "80%",
                },
                width: "100%",
              }}
            >
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
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
              </Stack>

              <Stack
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  pt: 3,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: "20px",
                    px: 2,
                    py: 1,
                    width: { lg: "100%" },
                  }}
                >
                  <Box
                    component="img"
                    src={ChatbotImage}
                    alt="Bot Avatar"
                    sx={{ width: 30, height: 32 }}
                  />
                  <Box
                    sx={{
                      mb: 1,
                      typography: "body1",
                      textAlign: "start",
                    }}
                  >
                    {/* response chart */}
                    {res?.bot_chart?.length > 0 && (
                      <>
                        {!res?.bot_chart?.includes("```") &&
                          res?.bot_chart?.includes("https") && (
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <img
                                  src={
                                    "https://" +
                                    res.bot_chart
                                      .replace(/^"/, "")
                                      .replace(/"$/, "")
                                      .split("https://")[1]
                                  }
                                  alt="Chart Komposisi Pegawai"
                                  style={{
                                    width: "50%",
                                    height: "auto",
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    paddingTop: "10px",
                                    paddingBottom: "20px",
                                    marginBottom: "20px",
                                  }}
                                />
                              </Box>
                              <Typography>
                                {res.bot_chart
                                  .split("https://")[0]
                                  .replace(/"/g, "")}
                              </Typography>
                            </Box>
                          )}
                      </>
                    )}

                    {/* response bot */}
                    {res.bot === "⌛" ? (
                      <>
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
                      </>
                    ) : (
                      <ReactMarkdown>{res.bot}</ReactMarkdown>
                    )}

                    {/* response source */}
                    {/* {res.source.length > 0 && (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            mt: 2,
                          }}
                        >
                          <Typography sx={{ fontWeight: 500, mr: 1 }}>
                            Source :
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            cursor: "pointer",
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
                                "&:hover": {
                                  borderColor: "red",
                                },
                              }}
                              onClick={() => {
                                setIsViewPdf(true);
                                setPdfSource(src);
                                setType(res.type);
                              }}
                            >
                              <Typography
                                align="start"
                                sx={{
                                  wordBreak: "break-word",
                                }}
                              >
                                📄 {src}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )} */}
                  </Box>
                </Box>
              </Stack>
            </Stack>
          ))}
          <Box ref={chatEndRef} />
        </Stack>
      )}

      <Stack
        sx={{
          position: responses.length > 0 ? "sticky" : "static",
          bottom: 0,
          zIndex: 10,
          maxWidth: {
            xs: "100%",
            md: responses.length > 0 ? "100%" : "80%",
          },
          mx: {
            xs: 0,
            md: "auto",
          },
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
                <MenuItem value="paraphrase-multilingual-mpnet-base-v2">
                  paraphrase-multilingual-mpnet-base-v2
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
      </Stack>
    </Stack>
  );
};

export default ChatBoxanalyst;
