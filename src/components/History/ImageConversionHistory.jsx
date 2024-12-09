import { OneHistory } from "./OneHistory"
import { useState } from "react"
import { useSelector } from "react-redux"
import { showAlert } from "../AlertLoader"
import axios from "axios"
import { useEffect } from "react"
export const ImageConversionHistory=()=>{
    const baseUrl=useSelector((state)=>state.baseUrl).backend
    const [historyData,setHistoryData]=useState([])
    const [nextUrl,setNextUrl]=useState(baseUrl + 'api/files/')
    
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
    useEffect(()=>{
        getMoreData();
    },[])
    return(
        <>
        <OneHistory featureName={'imageConversion'} historyData={historyData} setHistoryData={setHistoryData} getMoreData={getMoreData}/>
        </>
    )
}