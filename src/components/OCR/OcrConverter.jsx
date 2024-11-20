import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, DialogContentText, Paper, Box, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const OcrConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Renamed dialog state for clarity
  const token = localStorage.getItem('token');

  const [login, setLogin] = useState(token);

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setError("");
  };

  const handleConvert = async () => {
    if (!login) {
      setIsDialogOpen(true); // Show the dialog if user is not logged in
      return;
    }

    if (!selectedImage) {
      setError("Please upload an image file to convert.");
      return;
    }

    setIsLoading(true);
    setExtractedText(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await axios.post(
        'https://ocr.goodwish.com.np/api/image-to-text/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const textData = response.data.extracted_text[0];
      setExtractedText(textData);
    } catch (error) {
      setError("An error occurred while processing the image.");
      console.error("OCR error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;

    const textContent = [
      "Extracted Lines:\n",
      ...(extractedText.lines?.map((line) => line.text) || []),
      "\n\nExtracted Paragraphs:\n",
      ...(extractedText.paragraphs?.map((paragraph) => paragraph.text) || [])
    ].join("\n");

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Image to Text Converter</Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
          fullWidth
        >
          Upload Image
          <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
        </Button>
      </Box>

      {selectedImage && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected File: {selectedImage.name}
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
        sx={{ mb: 2 }} // Ensure some space below the button
      >
        Convert to Text
      </Button>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Processing...</Typography>
        </Box>
      )}

      {extractedText && (
        <Box sx={{ mt: 2, textAlign: 'left' }}>
          <Typography variant="h6">Extracted Text:</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>Lines:</Typography>
          {extractedText.lines?.map((line, index) => (
            <Typography key={index} variant="body2">{line.text}</Typography>
          ))}

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>Paragraphs:</Typography>
          {extractedText.paragraphs?.map((paragraph, index) => (
            <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {paragraph.text}
            </Typography>
          ))}

          {extractedText && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={handleDownload}
            >
              Download Text
            </Button>
          )}
        </Box>
      )}

      {/* Dialog for Login */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Login Required
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText style={{ textAlign: 'center', marginBottom: '20px' }}>
            Please log in to use this feature.
          </DialogContentText> */}
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
            login
          </Button>
          </NavLink>
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

export default OcrConverter;
