"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider,
  IconButton
} from "@mui/material";
import { ArrowBack, Send } from "@mui/icons-material";
import { useGetDocumentQuery, useSendMessageMutation } from "../../../api";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const { data: document, isLoading: isLoadingDoc } = useGetDocumentQuery(documentId);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: "Hello! I am your AI assistant. You can ask me to analyze the document, summarize it, or answer specific questions about its content.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const result = await sendMessage({ documentId, message: userMessage }).unwrap();
      setMessages((prev) => [...prev, { role: "agent", content: result.response }]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Sorry, I encountered an error while processing your request." },
      ]);
    }
  };

  if (isLoadingDoc) {
    return <CircularProgress />;
  }

  if (!document) {
    return <Typography color="error">Document not found.</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "85vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => router.push("/")} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">
          Chatting about: {document.originalName}
        </Typography>
      </Box>

      <Paper sx={{ flexGrow: 1, p: 2, overflowY: "auto", mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <Card
              sx={{
                bgcolor: msg.role === "user" ? "primary.dark" : "background.paper",
                color: msg.role === "user" ? "primary.contrastText" : "text.primary",
              }}
            >
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question or request a summary..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isSending}
          multiline
          maxRows={4}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          sx={{ minWidth: "56px" }}
        >
          {isSending ? <CircularProgress size={24} color="inherit" /> : <Send />}
        </Button>
      </Box>
    </Box>
  );
}
