import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

export default function DeleteAccount() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ password: '' });
  const [deleteError, setDeleteError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setDeleteError('');
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.delete(
          'https://ocr.goodwish.com.np/api/users/delete-account/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
            data: { password: formData.password }, // Include password here
          }
        );

        if (response.status === 200) {
          console.log('Account deleted successfully:', response.data);
          localStorage.clear();
          window.location.reload();
        } else {
          throw new Error('Failed to delete account.');
        }
      } catch (error) {
        console.error('Error deleting account:', error.response || error.message);
        if (error.response?.status === 401) {
          setDeleteError('Authentication failed. Please log in again.');
        } else if (error.response?.data?.password) {
          setDeleteError(error.response.data.password[0]);
        } else {
          setDeleteError('Failed to delete account. Please check your password.');
        }
      } finally {
        setIsLoading(false);
        setOpenDialog(false); // Close the dialog after attempt
      }
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-slate-400 to-indigo-600">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h5" className="font-semibold text-center text-red-600">
          Delete Account
        </Typography>
        <Typography variant="body2" className="mt-2 text-center text-gray-600">
          Enter your password to delete your account permanently.
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpenDialog(true); // Open dialog on form submission
          }}
          className="space-y-4"
        >
          <h1 className="p-2 py-3 my-2 font-semibold border-2 border-black border-solid">{email}</h1>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
          />

          {deleteError && (
            <Typography variant="body2" className="text-center text-red-500">
              {deleteError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={28} color="inherit" /> : 'Delete Account'}
          </Button>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
