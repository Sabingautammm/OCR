import React, { useState } from 'react';
import { CircularProgress, Button, Typography, Box, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from 'axios';

const ImgDocConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token')
  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setError("");
  };

  const handleConvert = async () => {
    if (!selectedImage) {
      setError("Please upload an image to convert.");
      return;
    }

    setIsLoading(true);
    setConvertedFileUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await axios.post(
        'https://ocr.goodwish.com.np/api/convert-doc/', // Replace with the actual endpoint
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const baseUrl = 'https://ocr.goodwish.com.np'; // Ensure this matches your server's base URL
      const fileUrl = `${baseUrl}${response.data.document}`; // Construct the full URL
      setConvertedFileUrl(fileUrl);
    } catch (error) {
      setError("An error occurred while converting the file.");
      console.error("Conversion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Image to Document Converter</Typography>

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
            download="converted_image.docx"
            fullWidth
          >
            Download Converted Document
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ImgDocConverter;
