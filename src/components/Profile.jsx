import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState({
    email: localStorage.getItem("email") || "",
    firstname: localStorage.getItem("firstname") || "",
    lastname: localStorage.getItem("lastname") || "",
    number: localStorage.getItem("number") || "",
    photo: localStorage.getItem("photo") || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    reEnterPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target; // Using `name` here, which matches the input field's `name` attribute
  
    setUserData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem(name, value); // Update localStorage
      return updatedData;
    });
  };
  

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    console.log(file); // Debugging: Check file details
    setUserData((prevData) => {
      const updatedData = { ...prevData, photo: file };
      return updatedData;
    });
  };
  

  const handlePasswordChange = (e) => {
    const { firstname, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [firstname]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    if (!token) {
      setErrorMessage("User is not logged in. Please log in again.");
      return;
    }
  
    const formData = new FormData();
  
    // Map your state keys to the expected keys
    formData.append("first_name", userData.firstname);
    formData.append("last_name", userData.lastname);
    formData.append("contact", userData.number);
  
    if (userData.photo instanceof File) {
      formData.append("photo", userData.photo); // Append photo if it's a file
    }
  
    try {
      const response = await axios.put(
        "https://ocr.goodwish.com.np/api/users/update-profile/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setErrorMessage("");
        alert("Profile updated successfully!");
  
        // Update localStorage with new values
        localStorage.setItem("firstname", userData.firstname);
        localStorage.setItem("lastname", userData.lastname);
        localStorage.setItem("number", userData.number);
        if (response.data.photo) {
          localStorage.setItem("photo", `https://ocr.goodwish.com.np${response.data.photo}`);
        }
  
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage(
        `Failed to update profile: ${error.response?.data?.detail || "Something went wrong!"}`
      );
    }
  };
  
  

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("User is not logged in. Please log in again.");
      return;
    }

    if (!passwordData.currentPassword || !passwordData.password || !passwordData.reEnterPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (passwordData.password !== passwordData.reEnterPassword) {
      setErrorMessage("New password and re-entered password do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "https://ocr.goodwish.com.np/api/users/update-profile/",
        passwordData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setErrorMessage(""); // Reset error message
        alert("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          password: "",
          reEnterPassword: "",
        });
        setShowPasswordForm(false);
      }
    } catch (error) {
      setErrorMessage(`Failed to update password: ${error.response?.data?.detail || "Something went wrong!"}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleShowPasswordForm = () => {
    setShowPasswordForm((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-slate-400 to-indigo-600">
      <form
        
        className="flex items-center justify-center w-full max-w-md px-4 py-6 bg-gray-100 rounded-lg"
      >
        <div className="w-full max-w-sm p-8 mx-auto transition duration-500 transform bg-white shadow-lg rounded-xl">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mb-4"
          />
          <img
            className="w-32 h-32 mx-auto border-4 border-blue-500 rounded-full"
            src={
              typeof userData.photo === "string"
                ? userData.photo.startsWith("http")
                  ? userData.photo
                  : `https://ocr.goodwish.com.np/${userData.photo.replace(/^\//, "")}`
                : userData.photo instanceof File
                ? URL.createObjectURL(userData.photo)
                : "https://via.placeholder.com/40"
            }
            alt="User"
          />
<input
  type="text"
  name="firstname"  // name should match the state key
  value={userData.firstname}
  onChange={handleChange}
  className="w-full px-4 py-2 mt-4 text-sm border rounded"
  placeholder="First Name"
/>

<input
  type="text"
  name="lastname"  // name should match the state key
  value={userData.lastname}
  onChange={handleChange}
  className="w-full px-4 py-2 mt-4 text-sm border rounded"
  placeholder="Last Name"
/>


          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-4 text-sm border rounded"
            placeholder="Email"
            disabled
          />
          <input
            type="text"
            name="number"
            value={userData.number}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-4 text-sm border rounded"
            placeholder="Phone Number"
          />
          
          {errorMessage && (
            <p className="mt-4 text-red-500">{errorMessage}</p>
          )}

          <div className="flex gap-2">
            <button
            onClick={handleUpdateProfile}
              type="submit"
              className="w-full py-3 mt-4 text-white transition duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg hover:from-green-600 hover:to-teal-600 hover:scale-105"
            >
              Update Profile
            </button>

            <button
              type="button"
              onClick={handleShowPasswordForm}
              className="w-full py-3 mt-4 text-white transition duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 hover:scale-105"
            >
              Change Password
            </button>
          </div>

          {showPasswordForm && (
            <div className="mt-4">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 mt-4 text-sm border rounded"
                placeholder="Current Password"
              />
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 mt-4 text-sm border rounded"
                placeholder="New Password"
              />
              <input
                type="password"
                name="reEnterPassword"
                value={passwordData.reEnterPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 mt-4 text-sm border rounded"
                placeholder="Re-enter New Password"
              />
              <button
                type="button"
                onClick={handleUpdatePassword}
                className="w-full py-3 mt-6 text-white transition duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 hover:scale-105"
              >
                Update Password
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-3 mt-4 text-white transition duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:from-red-600 hover:to-pink-600 hover:scale-105"
          >
            Log Out
          </button>

<NavLink to='/deleteAccount'>
          <button
        className="w-full py-3 mt-4 text-white transition duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-red-700 to-red-800 hover:scale-105"
      >
       Delete Account
      </button>
      </NavLink>
        </div>
      
      </form>
   
    </div>
  );
}
