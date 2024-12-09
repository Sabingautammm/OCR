import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash, faSync } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";  // Add this line
import { useSelector } from "react-redux";
import axios from "axios";
import { showAlert } from "../AlertLoader";
import { useImageConversionFile } from "./AppProivder";
import { Navigate } from "react-router-dom";

export const InstanceHistory = ({ featureName, instanceHistoryData, deleteInstance, downloadFile }) => {
  const isMobile = useMediaQuery({ query: '(max-width:1000px)' });
  const { imageConversionFile, setImageConversionFile } = useImageConversionFile() || {}; 
  const userInfo = useSelector((state) => state.userProfile);
  const [imageUrl, setImageUrl] = useState('');
  const baseUrl = useSelector((state) => state.baseUrl).backend;
  const [goToICActivate, setGoToICActivate] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        let imageUrl = null;
        switch (featureName) {
          case 'pdfConversion':
            imageUrl = instanceHistoryData.pages[0].image;
            break;
          case 'tableExtraction':
            imageUrl = instanceHistoryData.image;
            break;
          case 'documentAnalysis':
            imageUrl =  instanceHistoryData.image;
            break;
          case 'imageConversion':
            imageUrl = baseUrl + instanceHistoryData.pages[0].image.substr(1);
            break;
          default:
            imageUrl = null;
        }
        console.log(imageUrl);
        if (!imageUrl) {
          throw new Error('No image URL found');
        }

        const response = await axios.get(imageUrl, {
          headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
          },
          responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], { type: 'image/png' });
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        showAlert('Error fetching image: ' + error.message, 'red');
      }
    };

    fetchImage();
  }, [instanceHistoryData.pages, baseUrl, featureName]);

  if (goToICActivate) {
    return <Navigate to="/image-conversion" />;
  }

  // Function to handle history deletion
  const deleteHistory = async () => {
    try {
      let url = '';
      if (featureName === 'pdfConversion') {
        url = 'api/scanned-files/';
      } else if (featureName === 'tableExtraction') {
        url = 'api/images/';
      }
       else if (featureName === 'documentAnalysis') {
        url = 'api/convert-doc/';
      } else if (featureName === 'imageConversion') {
        url = 'api/files/';
      }
      // // Debugging logs
      // console.log("Feature Name:", featureName);
      // console.log("Instance ID:", instanceHistoryData.id);
      // console.log("Delete URL:", baseUrl + url + instanceHistoryData.id + "/");
      // console.log("Token:", token);

      const response = await axios.delete(baseUrl + url + instanceHistoryData.id+"/", {
        headers: {
                    Authorization: `Token ${token}`,
        }
      });

      showAlert('Deleted ' + instanceHistoryData.file.split('/').pop(), 'red');
      deleteInstance(instanceHistoryData);  // Update UI after deletion
    } catch (error) {
      console.error('Error deleting history:', error);
      showAlert('Error deleting history: ' + error.message, 'red');
    }
  };

  const handleDownload = async () => {
    try {
      if (featureName === 'imageConversion' && instanceHistoryData.pages[0].image) {
        const fileUrl = baseUrl + instanceHistoryData.pages[0].image.substr(1);
        downloadFile(fileUrl, instanceHistoryData.file.split('/').pop());
      } else if (featureName === 'tableExtraction') {
        const fileUrl = instanceHistoryData.download_url;  // Adjust based on actual API response
        downloadFile(fileUrl, `${userInfo.username}_${instanceHistoryData.created}.xlsx`);
      } else {
        showAlert('No valid file for download', 'red');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      showAlert('Error downloading file: ' + error.message, 'red');
    }
  };

  return (
    <div className="border bg-[white] hover:bg-gray-100 h-20 w-full flex items-center justify-center relative cursor-pointer">
      <div className="absolute flex items-center justify-center w-10 h-full left-2">
        <img src={imageUrl} alt={instanceHistoryData.id} />
      </div>
      <div className="absolute left-16 w-[200px] overflow-hidden">
        {featureName !== 'tableExtraction' && instanceHistoryData.file.split('/').pop()}
        {featureName === 'tableExtraction' && userInfo.username + instanceHistoryData.created + '.xlsx'}
      </div>
      {!isMobile &&
        <div className="absolute left-[50%] w-[200px] overflow-hidden sm:hidden lg:flex">
          {instanceHistoryData.created}
        </div>
      }
      <div className="absolute left-[85%]">
        <FontAwesomeIcon icon={faTrash} onClick={deleteHistory} className="h-[80%] w-[20px] hover:h-[90%] hover:w-[22px]" />
      </div>
      <div className="absolute left-[95%]">
        {featureName === 'imageConversion'
          ? <FontAwesomeIcon icon={faDownload} onClick={handleDownload} />
          : <FontAwesomeIcon icon={faDownload} onClick={handleDownload} className="h-[80%] w-[20px] hover:h-[90%] hover:w-[22px]" />
        }
      </div>
    </div>
  );
};
