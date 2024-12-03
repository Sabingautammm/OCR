import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, Input } from '@mui/material';
import axios from 'axios';

const SignUpForm = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
    contact: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [signUpError, setSignUpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");  // Add this state for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));  // Create preview for photo
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }
    if (!formData.contact) {
      newErrors.contact = 'Contact is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignUpError("");
    setSuccessMessage("");  // Clear any previous success message

    if (validate()) {
      setIsLoading(true);
      const payload = new FormData();

      // Exclude `confirmPassword` from the payload
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          payload.append(key, value);
        }
      });

      try {
        const response = await axios.post('http://192.168.1.83:8000/api/users/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Set success message instead of alert
        setSuccessMessage("User signed up successfully, please check your email to confirm.");

        // Optionally, you can reload or redirect after successful sign-up
        window.location.reload();
      } catch (error) {
        setSignUpError("Sign-up failed. Please try again.");
        console.error('Error signing up:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        textAlign: 'center',
        px: 2,
        py: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'white',
        maxWidth: '400px',
        maxHeight: 'auto',
        margin: '0 auto',
      }}
    >
      <Avatar
        src={photoPreview}
        sx={{ width: 90, height: 90, margin: '0 auto', mb: 3, border: '2px solid #1976d2' }}
      />
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
        Upload Profile Picture
      </Typography>
      <Input
        fullWidth
        type="file"
        name="photo"
        onChange={handleFileChange}
        sx={{ mb: 1, borderRadius: '8px', border: '1px solid #ddd' }}
      />

      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        margin="normal"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={!!errors.username}
        helperText={errors.username}
        required
        sx={{ mb: 0 }}
      />

      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        margin="normal"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        required
        sx={{ mb: 0 }}
      />

      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        margin="normal"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        required
        sx={{ mb: 0 }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        variant="outlined"
        margin="normal"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        required
        sx={{ mb: 0 }}
      />

      <TextField
        fullWidth
        label="First Name"
        variant="outlined"
        margin="normal"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        error={!!errors.first_name}
        helperText={errors.first_name}
        required
        sx={{ mb: 0 }}
      />

      <TextField
        fullWidth
        label="Last Name"
        variant="outlined"
        margin="normal"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        error={!!errors.last_name}
        helperText={errors.last_name}
        required
        sx={{ mb: 0 }}
      />

      <TextField
        fullWidth
        label="Contact"
        variant="outlined"
        margin="normal"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        error={!!errors.contact}
        helperText={errors.contact}
        required
        sx={{ mb: 0 }}
      />

      {signUpError && (
        <Typography color="error" variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          {signUpError}
        </Typography>
      )}

      {successMessage && (
        <Typography color="primary" variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          {successMessage}
        </Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          mt: 3,
          py: 1.5,
          textTransform: 'none',
          fontWeight: 'bold',
          boxShadow: 2,
          '&:hover': {
            boxShadow: 6,
            backgroundColor: 'primary.dark',
          },
        }}
        disabled={isLoading}
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignUpForm;
