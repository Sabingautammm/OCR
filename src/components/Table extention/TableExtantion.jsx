import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Button, Typography, CircularProgress, Box, Alert
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const TableExtension = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const token = localStorage.getItem('token')
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleExtractTable = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('async', 'false');
    formData.append('inline', 'true');

    const isPdf = selectedFile.type === 'application/pdf';

    try {
      const response = await axios.post(
        isPdf ? 'https://api.pdf.co/v1/pdf/convert/to/csv' : 'https://ocr.goodwish.com.np/api/images/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token}` ,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      const jsonData = response.data.imagedata[0];
      const rows = Object.values(jsonData); // Converts object rows into an array of arrays
      setTableData(rows);
    } catch (error) {
      setError('Failed to extract table data. Please try again with a valid PDF or image file.');
      console.error('Error extracting table:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'extracted_table.csv';
    link.click();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} sx={{ width: '90%', margin: 'auto', mt: 4, p: 3, borderRadius: 2 }}>
      <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
        Table Extractor (PDF or Image)
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          sx={{ backgroundColor: '#1976d2' }}
        >
          Upload File
          <input
            type="file"
            accept="application/pdf, image/png, image/jpeg"
            onChange={handleFileChange}
            hidden
          />
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleExtractTable}
          disabled={loading || !selectedFile}
          sx={{ ml: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Extract Table"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {tableData.length > 0 ? (
        <>
          <TableContainer sx={{ maxHeight: 400, mt: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {tableData[0].map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.slice(1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tableData.length - 1}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={handleDownloadCSV}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Download CSV
            </Button>
          </Box>
        </>
      ) : (
        !loading && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            Upload a PDF or image file to extract and preview table data.
          </Typography>
        )
      )}
    </Paper>
  );
};

export default TableExtension;
