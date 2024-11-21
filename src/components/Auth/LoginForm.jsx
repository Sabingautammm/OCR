import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'username is required';
      isValid = false;
    } else if ('') {
      newErrors.username = 'username address is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.post('https://ocr.goodwish.com.np/api/login/', formData);
        console.log("Login successful:", response.data);
        if (response.status=202) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('name', response.data.first_name)
          localStorage.setItem('email', response.data.email)
          localStorage.setItem('photo', response.data.photo)
          window.location.reload()

        }
        // Redirect or perform further actions here
      } catch (error) {
        setLoginError("Login failed. Please check your credentials and try again. or make sure to check gmail for verification");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="username"
        variant="outlined"
        margin="normal"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={!!errors.username}
        helperText={errors.username}
        required
      />
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
      {loginError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {loginError}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2, py: 1.2 }}
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </Box>
  );
};

export default LoginForm;