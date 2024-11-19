import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Button, Typography, CircularProgress, Box, Alert
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import * as XLSX from 'xlsx';

const TableExtension = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]); // Array to store multiple tables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    tableData.forEach((table, index) => {
      const ws = XLSX.utils.json_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
    });
    XLSX.writeFile(wb, 'extracted_tables.xlsx');
  };

  const handleExtractTable = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    const isPdf = selectedFile.type === 'application/pdf';
    const formData = new FormData();
    formData.append(isPdf ? 'file' : 'image', selectedFile);
    formData.append('async', 'false');
    formData.append('inline', 'true');
  
    try {
      const response = await axios.post(
        isPdf ? 'https://ocr.goodwish.com.np/api/pdf-table-extraction/' : 'https://ocr.goodwish.com.np/api/images/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      const allTables = response.data.imagedata; // Array of tables
      const processedTables = allTables.map((tableData) => Object.values(tableData));
      setTableData(processedTables);
    } catch (error) {
      // Check for server error response and set it in the error state
      const errorMessage = error.response?.data?.error || 'Failed to extract table data. Please try again.';
      setError(errorMessage);
      console.error('Error extracting table:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: 'auto', textAlign: 'center', marginTop: 10 }}>
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
        tableData.map((table, tableIndex) => (
          <Box key={tableIndex} sx={{ mb: 5 }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              Table {tableIndex + 1}
            </Typography>
            <TableContainer sx={{ maxHeight: 400, mt: 2 }}>
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
                  {table.slice(1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <TablePagination
              component="div"
              count={table.length - 1}
              page={page}
              // onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 50]}
            /> */}
          </Box>
        ))
      ) : (
        !loading && (
          <div>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            Upload a PDF or image file to extract and preview table data.
          </Typography>
              {/* <Typography variant="body1" className='text-red-500' sx={{ mt: 0 }}>
              "Upload a PDF with up to 3 pages that includes a table."
            </Typography> */}
            </div>
        )
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={handleDownloadExcel}
          sx={{ backgroundColor: '#4caf50' }}
        >
          Download 
        </Button>
      </Box>
    </Paper>
  );
};

export default TableExtension;
