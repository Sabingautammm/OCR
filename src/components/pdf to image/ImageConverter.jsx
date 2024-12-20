import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box, Paper, Grid, Dialog, DialogContent, IconButton, DialogActions, DialogTitle } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NavLink } from 'react-router-dom';

const ImageConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);
  const [error, setError] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state for login alert
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setError('');
    setConvertedImages([]);
  };

  const handleConvert = async () => {
    if (!token) {
      setIsDialogOpen(true); // Show the login dialog if user is not logged in
      return;
    }

    if (!pdfFile) {
      setError('Please upload a PDF file to convert.');
      return;
    }

    setIsLoading(true);
    setError('');
    setConvertedImages([]);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch('https://ocr.goodwish.com.np/api/files/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      // Check if the server returned an error
      if (data.error) {
        setError(data.error); // Display the error message from the server
        setIsLoading(false);
        return;
      }

      const baseUrl = 'https://ocr.goodwish.com.np/'; // Replace with your server base URL
      const imageUrls = data.file.pages.map((page) => `${baseUrl}${page.image}`);
      setConvertedImages(imageUrls);
    } catch (error) {
      setError(error.message || 'Failed to convert PDF. Please try again.');
      console.error('Error during conversion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => setOpenPreview(true);
  const handleClosePreview = () => setOpenPreview(false);

  const handleDownloadAll = async () => {
    if (convertedImages.length === 1) {
      try {
        const response = await fetch(convertedImages[0]);
        const blob = await response.blob();
        saveAs(blob, 'converted_image.jpg');
      } catch (error) {
        console.error('Error downloading image:', error);
        setError('Failed to download the image. Please try again.');
      }
    } else {
      const zip = new JSZip();
      const folder = zip.folder('pdf_images');

      try {
        await Promise.all(
          convertedImages.map(async (url, index) => {
            const response = await fetch(url);
            const blob = await response.blob();
            folder.file(`page_${index + 1}.jpg`, blob);
          })
        );

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'pdf_images.zip');
      } catch (error) {
        console.error('Error creating ZIP:', error);
        setError('Failed to download images. Please try again.');
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the login dialog
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10,marginBottom:10}}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        PDF to Image Converter
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth>
          Upload PDF
          <input type="file" hidden onChange={handleFileChange} accept="application/pdf" />
        </Button>
      </Box>
      <div className="flex items-center justify-center">
  <p className="font-bold text-lg text-gray-700 mr-2">Note:</p>
  <h3 className="font-semibold text-green-600 text-md my-2">Upload a PDF with less than 3 pages</h3>
</div>

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

      <Button variant="contained" color="primary" fullWidth onClick={handleConvert} disabled={isLoading}>
        Convert to Images
      </Button>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Converting...</Typography>
        </Box>
      )}

      {convertedImages.length > 0 && (
        <>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            onClick={handlePreview}
            sx={{ mt: 2 }}
            startIcon={<ImageIcon />}
          >
            Preview Images
          </Button>

          <Grid container spacing={1} sx={{ mt: 2 }}>
            {convertedImages.map((url, index) => (
              <Grid item xs={4} key={index}>
                <img
                  src={url}
                  alt={`Page ${index + 1}`}
                  style={{ width: '100%', cursor: 'pointer' }}
                  onClick={handlePreview}
                />
              </Grid>
            ))}
          </Grid>

          <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="lg">
            <DialogContent>
              <IconButton
                aria-label="close"
                onClick={handleClosePreview}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {convertedImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Converted Page ${index + 1}`}
                    style={{ width: '100%', marginBottom: 10 }}
                  />
                ))}
              </Box>
            </DialogContent>
          </Dialog>

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleDownloadAll}
          >
            Download All Images
          </Button>
        </>
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

export default ImageConverter;
