import { useMediaQuery } from "react-responsive";  // Ensure this import is present
import { InstanceHistory } from "./InstanceHistory"; // Import InstanceHistory
import { showAlert } from "../AlertLoader"; // Ensure the AlertLoader import is correct

export const OneHistory = ({ featureName, getMoreData, historyData, setHistoryData, downloadFile }) => {
    const isMobile = useMediaQuery({ query: '(max-width:1000px)' });

    const deleteInstance = (instance) => {
        try {
            const oldList = historyData;
            const newList = oldList.filter(item => item !== instance);
            setHistoryData(newList);
        } catch (error) {
            showAlert(error, 'red');
            console.log(error);
        }
    };

    return (
        <div className="bg-gray-200 w-[80%] rounded-md flex flex-col items-start mt-2 shadow-md">
            <div className={`bg-gray-300 w-full h-[50px] relative items-center justify-between flex shadow-lg`}>
                <div className="absolute left-[10%]">
                    Name
                </div>
                {!isMobile &&
                    <div className="absolute left-[60%] flex">
                        Date
                    </div>}
            </div>
            <div className="flex-col flex-wrap w-full">
                {
                    historyData.map((value, index) => (
                        <InstanceHistory 
                            key={`${value.id}-${index}`} // Combining id and index to ensure uniqueness
                            featureName={featureName}
                            instanceHistoryData={value}
                            downloadFile={downloadFile}
                            deleteInstance={deleteInstance}
                        />
                    ))
                }
                <div className="bg-[white] hover:bg-gray-100 font-bold border-b h-10 w-full flex items-center justify-center cursor-pointer" onClick={getMoreData}>
                    ...
                </div>
            </div>
        </div>
    );
};
