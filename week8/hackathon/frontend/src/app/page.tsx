"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useUploadDocumentMutation, useGetDocumentsQuery } from "../api";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const { data: documents, isLoading: isLoadingDocs, refetch } = useGetDocumentsQuery();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadDocument(formData).unwrap();
      refetch();
      router.push(`/chat/${response.documentId}`);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 4, p: 2, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upload a PDF Document
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The Document Analysis Agent will automatically process your PDF.
          </Typography>
          
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ mr: 2 }}
          >
            Select File
            <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
          </Button>

          {file && (
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              Selected: {file.name}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || isLoading}
            sx={{ mt: file ? 0 : 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Upload & Analyze"}
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Previous Documents
      </Typography>
      {isLoadingDocs ? (
        <CircularProgress />
      ) : documents && documents.length > 0 ? (
        <Card>
          <List>
            {documents.map((doc) => (
              <ListItem key={doc._id} disablePadding>
                <ListItemButton onClick={() => router.push(`/chat/${doc._id}`)}>
                  <ListItemText
                    primary={doc.originalName}
                    secondary={new Date(doc.createdAt).toLocaleString()}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Card>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No documents uploaded yet.
        </Typography>
      )}
    </Box>
  );
}
