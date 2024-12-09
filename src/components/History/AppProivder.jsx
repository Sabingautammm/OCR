import React, { useState, createContext } from "react";

// Create contexts with default values
const PdfConversionContext = createContext({
  pdfConversionFile: { inputFiles: [], result: [], name: '' },
  setPdfConversionFile: () => {}
});
const TableExtractionContext = createContext({
  tableExtractionFile: { inputFiles: [], result: [], name: '' },
  setTableExtractionFile: () => {}
});
const DocumentAnalysisContext = createContext({
  documentAnalysisFile: { inputFiles: [], result: [], name: '' },
  setDocumentAnalysisFile: () => {}
});
const ImageConversionContext = createContext({
  imageConversionFile: { result: [], inputFiles: [], name: '' },
  setImageConversionFile: () => {}
});

export const AppProvider = ({ children }) => {
  const [pdfConversionFile, setPdfConversionFile] = useState({
    inputFiles: [],
    result: [],
    name: ''
  });
  const [tableExtractionFile, setTableExtractionFile] = useState({
    inputFiles: [],
    result: [],
    name: ''
  });
  const [documentAnalysisFile, setDocumentAnalysisFile] = useState({
    inputFiles: [],
    result: [],
    name: ''
  });
  const [imageConversionFile, setImageConversionFile] = useState({
    result: [],
    inputFiles: [],
    name: ''
  });

  return (
    <PdfConversionContext.Provider value={{ pdfConversionFile, setPdfConversionFile }}>
      <TableExtractionContext.Provider value={{ tableExtractionFile, setTableExtractionFile }}>
        <DocumentAnalysisContext.Provider value={{ documentAnalysisFile, setDocumentAnalysisFile }}>
          <ImageConversionContext.Provider value={{ imageConversionFile, setImageConversionFile }}>
            {children}
          </ImageConversionContext.Provider>
        </DocumentAnalysisContext.Provider>
      </TableExtractionContext.Provider>
    </PdfConversionContext.Provider>
  );
};

export const usePdfConversionFile = () => React.useContext(PdfConversionContext);
export const useTableExtractionFile = () => React.useContext(TableExtractionContext);
export const useDocumentAnalysisFile = () => React.useContext(DocumentAnalysisContext);
export const useImageConversionFile = () => React.useContext(ImageConversionContext);
