import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { showAlert, activate_loader } from '../AlertLoader/index';
import { OneHistory } from "./OneHistory";
import * as XLSX from 'xlsx';

export const DocumentAnalysisHistory = () => {
    const baseUrl = useSelector((state) => state.baseUrl).backend;
    const userInfo = useSelector((state) => state.userProfile);
    const [historyData, setHistoryData] = useState([]);
    const [nextUrl, setNextUrl] = useState(baseUrl + 'api/convert-doc/');

    const getMoreData = async () => {
        try {
            if (nextUrl === null) {
                showAlert('No More History', 'red');
            } else {
                const response = await axios.get(nextUrl, {
                    headers: { 'Authorization': 'Token ' + localStorage.getItem('token') }
                });

                // Set the next URL for pagination
                setNextUrl(response.data.next);

                // Remove duplicates by filtering based on 'id'
                setHistoryData(prevData => {
                    const newData = response.data.results;
                    const combinedData = [...prevData, ...newData];

                    // Remove duplicates based on 'id'
                    const uniqueData = combinedData.filter((value, index, self) =>
                        index === self.findIndex((t) => t.id === value.id)
                    );
                    return uniqueData;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const downloadFile = async (instanceFile) => {
        try {
            console.log(instanceFile);
            activate_loader(true);
            const response = await axios.get(instanceFile.document, {
                responseType: 'arraybuffer',
            });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = instanceFile.document.split('/').pop();
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            showAlert(error, 'red');
            console.log(error);
        } finally {
            activate_loader(false);
        }
    }

    useEffect(() => {
        getMoreData();
    }, [])

    return (
        <div className="flex justify-center w-full">
            <OneHistory
                featureName={'documentAnalysis'}
                getMoreData={getMoreData}
                historyData={historyData}
                setHistoryData={setHistoryData}
                downloadFile={downloadFile}
            />
        </div>
    );
}
