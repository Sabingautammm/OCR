import React, { useState } from 'react';
import { CircularProgress, Button, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const DocumentConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state for login alert
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setError("");
  };

  const handleConvert = async () => {
    if (!token) {
      setIsDialogOpen(true); // Show the login dialog if user is not logged in
      return;
    }

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
      console.error("Conversion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the login dialog
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10 ,marginBottom:10}}>
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

        
        </Box>
      )}

      {/* Dialog for Login */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Login Required
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" align="center">
            You need to be logged in to access this feature. Please click the button below to Login.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <NavLink to='/auth'>
            <Button
              color="primary"
              variant="contained"
              style={{ borderRadius: '15px', padding: '10px 20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              size="large"
            >
              Login
            </Button>
          </NavLink>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DocumentConverter;
