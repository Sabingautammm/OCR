import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { showAlert } from "../AlertLoader";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import * as pdfjsLib from "pdfjs-dist";
import pdflogo from '../../Media/pdfimage.png';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const HistoryMainPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width:1000px)" });
    const baseUrl = useSelector((state) => state.baseUrl).backend;
    const token = localStorage.getItem("token");
    const [historyData, setHistoryData] = useState([]);
    const [previews, setPreviews] = useState({});
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState(null);

    useEffect(() => {
        const fetchAllHistories = async () => {
            try {
                const responses = await Promise.all([ 
                    axios.get(`${baseUrl}api/scanned-files/`, { headers: { Authorization: `Token ${token}` } }),
                    axios.get(`${baseUrl}api/images/`, { headers: { Authorization: `Token ${token}` } }),
                    axios.get(`${baseUrl}api/convert-doc/`, { headers: { Authorization: `Token ${token}` } }),
                    axios.get(`${baseUrl}api/files/`, { headers: { Authorization: `Token ${token}` } }),
                ]);

                const combinedData = responses.flatMap((response, index) =>
                    response.data.results.map((item) => ({
                        input: item.file || item.image || "Unknown",
                        output: item.document || item.file || "Unknown",
                        date: moment(item.created).format("YYYY-MM-DD HH:mm") || "Unknown",
                        feature: ["PDF Conversion", "Table Extraction", "Document Analysis", "Image Conversion"][index],
                        id: item.id,
                    }))
                );

                setHistoryData(combinedData);

                combinedData.forEach((item) => {
                    if (/\.(jpeg|jpg|png|gif|webp)$/i.test(item.input) || /\.(jpeg|jpg|png|gif|webp)$/i.test(item.output)) {
                        setPreviews((prev) => ({
                            ...prev,
                            [item.id]: { input: item.input, output: item.output },
                        }));
                    } else if (/\.pdf$/i.test(item.input) || /\.pdf$/i.test(item.output)) {
                        if (item.input) {
                            generatePdfPreview(item.input, (preview) => {
                                setPreviews((prev) => ({
                                    ...prev,
                                    [item.id]: { input: preview, output: prev[item.id]?.output },
                                }));
                            });
                        }
                        if (item.output) {
                            generatePdfPreview(item.output, (preview) => {
                                setPreviews((prev) => ({
                                    ...prev,
                                    [item.id]: { output: preview, input: prev[item.id]?.input },
                                }));
                            });
                        }
                    }
                });
            } catch (error) {
                console.error("Error fetching history data:", error);
                showAlert("Error fetching history data. Please try again later.", "red");
            }
        };

        fetchAllHistories();
    }, [baseUrl, token]);

    const generatePdfPreview = async (url, callback) => {
        try {
            const pdf = await pdfjsLib.getDocument({ url }).promise;
            const page = await pdf.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const context = canvas.getContext("2d");
            await page.render({ canvasContext: context, viewport }).promise;

            const image = canvas.toDataURL("image/png");
            callback(image);
        } catch (error) {
            // console.error("Error generating PDF preview:", error);
            callback(null);
        }
    };

    const handleDelete = async (id, feature) => {
        let deleteUrl = "";
        
        switch (feature) {
            case "PDF Conversion":
                deleteUrl = `${baseUrl}api/convert-doc/${id}/`; 
                break;
            case "Table Extraction":
                deleteUrl = `${baseUrl}api/scanned-files/${id}/`; 
                break;
            case "Document Analysis":
                deleteUrl = `${baseUrl}api/files/${id}/`; 
                break;
            case "Image Conversion":
                deleteUrl = `${baseUrl}api/images/${id}/`; 
                break;
            default:
                console.log("Feature type not recognized for deletion");
                return;
        }
    
        console.log("Deleting from URL:", deleteUrl); // Debugging log
    
        try {
            await axios.delete(deleteUrl, { headers: { Authorization: `Token ${token}` } });
            setHistoryData((prevHistory) => prevHistory.filter(item => item.id !== id));
            showAlert("Item deleted successfully.", "green");
        } catch (error) {
            console.error("Error deleting item:", error);
            showAlert("Error deleting item. Please try again later.", "red");
        }
    };
    
    
    

    const handleDownload = (fileUrl) => {
        console.log("Downloading file:", fileUrl);  // Check if the function is called
        if (fileUrl) {
            const link = document.createElement('a');
            const fileName = fileUrl.split("/").pop();
            link.href = fileUrl;
            link.download = fileName;
            link.click();
        } else {
            showAlert("File not available for download.", "red");
        }
    };
    
    

    const renderPreview = (url, preview, id) => {
        const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
        const isPDF = /\.pdf$/i.test(url);

        const handleClick = () => {
            if (isPDF) {
                setCurrentPdfUrl(url);
                setPdfModalOpen(true);
            } else {
                const newTab = window.open();
                newTab.document.body.innerHTML = `<img src="${url}" alt="Image Preview" class="max-w-full max-h-screen object-contain" />`;
            }
        };

        return (
            <div className="cursor-pointer">
                {isImage || isPDF ? (
                    <img
                        src={preview || pdflogo}
                        alt="Preview"
                        className="object-cover w-16 h-16 transition-opacity duration-300 rounded-md hover:opacity-80"
                        onClick={handleClick}
                    />
                ) : (
                    <img
                        src={pdflogo}
                        alt="File Preview"
                        className="object-cover w-16 h-16 rounded-md"
                    />
                )}
            </div>
        );
    };

    const closePdfModal = () => {
        setPdfModalOpen(false);
        setCurrentPdfUrl(null);
    };

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <div className="w-full p-6 mx-auto bg-white rounded-md shadow-lg md:w-4/5 lg:w-3/4 xl:w-2/3">
                <h2 className="mb-4 text-2xl font-semibold text-center">History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-auto">
                        <thead>
                            <tr className="text-gray-700 bg-gray-200">
                                <th className="p-3 text-sm font-semibold">Feature</th>
                                <th className="p-3 text-sm font-semibold">Input</th>
                                <th className="p-3 text-sm font-semibold">Output</th>
                                <th className="p-3 text-sm font-semibold">Date</th>
                                <th className="p-3 text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.length ? (
                                historyData.map((item) => (
                                    <tr key={item.id} className="transition-all border-t border-gray-300 hover:bg-gray-50">
                                        <td className="p-3 text-sm">{item.feature}</td>
                                        <td className="p-3">{renderPreview(item.input, previews[item.id]?.input, item.id)}</td>
                                        <td className="p-3">{renderPreview(item.output, previews[item.id]?.output, item.id)}</td>
                                        <td className="p-3 text-sm">{item.date}</td>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                   onClick={() => handleDelete(item.id, item.feature)}
                                                    className="px-3 py-1 text-sm text-white transition bg-red-600 rounded-md hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(item.output)}
                                                    className="px-3 py-1 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-sm text-center text-gray-500">
                                        No history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pdfModalOpen && currentPdfUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-w-4xl max-h-full p-6 overflow-auto bg-white rounded-lg shadow-lg">
                        <button onClick={closePdfModal} className="absolute font-bold text-red-600 top-2 right-2">X</button>
                        <iframe
                            src={currentPdfUrl}
                            title="PDF Preview"
                            className="w-full h-[80vh] border-0"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryMainPage;
