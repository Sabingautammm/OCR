import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { CircularProgress, Button, Typography, Box, Paper, TextareaAutosize } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Reader = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setError('');
      const fileType = file.type;

      if (fileType === 'application/pdf') {
        extractTextFromPDF(file);
      } else if (fileType.startsWith('image/')) {
        extractTextFromImage(file);
      } else {
        setError("Please upload an image or PDF file.");
        setLoading(false);
      }
    }
  };

  const extractTextFromImage = (file) => {
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    )
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in image text recognition:", error);
        setError("Error in image text recognition.");
        setLoading(false);
      });
  };

  const extractTextFromPDF = async (file) => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let extractedText = '';
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(' ');
          extractedText += `\nPage ${pageNum}:\n${pageText}\n`;
        }
        
        setText(extractedText);
        setLoading(false);
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error in PDF text extraction:", error);
      setError("Error in PDF text extraction.");
      setLoading(false);
    }
  };

  const handleListen = () => {
    if (text) {
      const speech = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(speech);
    } else {
      setError("No text available to read.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Text Reader</Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
          fullWidth
        >
          Upload File
          <input type="file" hidden onChange={handleFileUpload} accept="image/*,application/pdf" />
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="subtitle2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Extracting text...</Typography>
        </Box>
      ) : (
        <TextareaAutosize
          minRows={6}
          value={text}
          readOnly
          placeholder="Extracted text will appear here..."
          style={{
            width: '100%',
            padding: 10,
            marginTop: 10,
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.23)',
            outline: 'none',
          }}
        />
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleListen}
        disabled={loading || !text}
        startIcon={<VolumeUpIcon />}
        sx={{ mt: 2 }}
      >
        Listen
      </Button>
    </Paper>
  );
};

export default Reader;
