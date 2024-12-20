import React, { useState } from 'react';
import {
  CircularProgress,
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { NavLink } from 'react-router-dom';

const TableExtension = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state for login
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleExtractTable = async () => {
    if (!token) {
      setIsDialogOpen(true); // Show the dialog if user is not logged in
      return;
    }

    if (!selectedFile) {
      setError('Please upload a PDF or image file to extract tables.');
      return;
    }

    setLoading(true);
    setError(null);
    const isPdf = selectedFile.type === 'application/pdf';
    const formData = new FormData();
    formData.append(isPdf ? 'file' : 'image', selectedFile);

    try {
      const response = await axios.post(
        isPdf
          ? 'https://ocr.goodwish.com.np/api/pdf-table-extraction/'
          : 'https://ocr.goodwish.com.np/api/images/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const allTables = response.data.imagedata;
      const processedTables = allTables.map((tableData) => Object.values(tableData));
      setTableData(processedTables);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to extract table data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    tableData.forEach((table, index) => {
      const ws = XLSX.utils.json_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
    });
    XLSX.writeFile(wb, 'extracted_tables.xlsx');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, maxWidth: 500, margin: 'auto', textAlign: 'center', marginTop: 10, marginBottom: 10 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Table Extractor (PDF or Image)
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth>
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="application/pdf, image/png, image/jpeg"
          />
        </Button>
      </Box>
      <div className="flex items-center justify-center">
  <p className="font-bold text-lg text-gray-700 mr-2">Note:</p>
  <h3 className="font-semibold text-green-600 text-md my-2">Upload a PDF with less than 3 pages</h3>
</div>
      {selectedFile && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected File: {selectedFile.name}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleExtractTable}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Extract Table'}
      </Button>

      {tableData.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {tableData.map((table, tableIndex) => (
            <Box key={tableIndex} sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Table {tableIndex + 1}
              </Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {table[0].map((header, index) => (
                        <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {table.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
          <Button
            variant="contained"
            color="success"
            startIcon={<CloudDownloadIcon />}
            onClick={handleDownloadExcel}
            fullWidth
            sx={{ mt: 3 }}
          >
            Download All Tables as Excel
          </Button>
        </Box>
      )}

      {!tableData.length && !loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Upload a PDF or image file to extract and preview table data.
        </Typography>
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
          <NavLink to="/auth">
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

export default TableExtension;
