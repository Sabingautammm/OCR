import React, { useState } from 'react';
import { CircularProgress, Button, Typography, Box, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const DocumentConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setError("");
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file to convert.");
      return;
    }

    setIsLoading(true);
    setConvertedFileUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await axios.post(
        'https://ocr.goodwish.com.np/api/pdf-to-docx/', // Replace with actual PDF-to-DOC API endpoint
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'json' // Expecting JSON response
        }
      );

      // Check if the response contains the document path
      if (response.data && response.data.document) {
        const baseUrl = 'https://ocr.goodwish.com.np'; // Ensure this matches your server's base URL
        const fileUrl = `${baseUrl}${response.data.document}`; // Construct full URL
        setConvertedFileUrl(fileUrl);
      } else {
        setError("Document conversion failed or returned empty.");
      }
    } catch (error) {
      // setError("An error occurred while converting the file.");
      console.error("Conversion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    window.open(convertedFileUrl, '_blank');
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>PDF to Document Converter</Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
          fullWidth
        >
          Upload PDF
          <input type="file" hidden onChange={handleFileChange} accept="application/pdf" />
        </Button>
      </Box>

      {pdfFile && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected File: {pdfFile.name}
        </Typography>
      )}

      {error && (
        <Typography color="error" variant="subtitle2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConvert}
        disabled={isLoading}
      >
        Convert to DOCX
      </Button>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Converting...</Typography>
        </Box>
      )}

      {convertedFileUrl && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CloudDownloadIcon />}
            href={convertedFileUrl}
            download="converted_document.docx" // Suggest a filename
            fullWidth
          >
            Download Converted Document
          </Button>

          {/* <Button
            variant="outlined"
            color="secondary"
            startIcon={<VisibilityIcon />}
            onClick={handlePreview}
            fullWidth
            sx={{ mt: 1 }}
          >
            Preview Converted Document
          </Button> */}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentConverter;
