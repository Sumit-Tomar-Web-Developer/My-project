import { useEffect, useState, Fragment } from 'react';
import { Box, Button, ButtonGroup, CircularProgress } from '@mui/material';
import { getRequest } from '../../AppApis/ApiFunctions';
import { API_URLS, TOOL_API_URL } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getTokenFromLocal } from '../../Utils/LocalStorageUtil';
import axios from 'axios';
import { getWindowDimensions } from '../../Utils/UtilityFunctions';

const PdfViewComponent = ({ projectID }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchPdfDocument();
    }, []);


    const loadPdfView = async (index, guid) => {
        setSelectedFileId(index);
        setIsLoading(true);
        if (guid) {
            const baseTenderUrl = `/files/${guid}/${projectID}`;
            const fileResponse = await axios({
                url: TOOL_API_URL + baseTenderUrl,
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    Authorization: "Bearer " + getTokenFromLocal()
                }
            });
            if (fileResponse.status === 200 && fileResponse.data) {
                const blob = new Blob([fileResponse.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            }
        }
        setIsLoading(false);
    }

    const fetchPdfDocument = async () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_DOCS_DETAILS}`;

        setIsLoading(true);

        try {
            const response = await getRequest(baseTenderUrl);
            if (response.data) {
                if (response.data.type === API_STATUS.SUCCESS) {
                    let tempFileList = response.data.data.fileList || [];
                    setFileList(tempFileList);
                    if(tempFileList.length > 0){
                        await loadPdfView(0,  tempFileList[0].guid);
                    }
                    else{
                        setSelectedFileId(-1); 
                    }
                } else {
                    setError(response.data.message);
                }
            }

            
        } catch (err) {
            setError(err.message || 'Error fetching the PDF document.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fileGroupButtons = () => {
        if(fileList.length > 0){
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& > *': {
                        m: 1,
                        },
                    }}
                    >
                    <ButtonGroup color="secondary" variant="outlined" aria-label="Tender File">
                        {fileList.map((file, index) => (
                            <Button loading={selectedFileId=== index && isLoading}  key={"File_"+index} variant={selectedFileId === index ? "contained" : "outlined"} 
                            onClick={() => loadPdfView(index, file.guid)}>File-{index+1}</Button>
                        ))}
                    </ButtonGroup>
                </Box>
            )
        }
    }

    if (isLoading) {
        return (
            <Fragment>
                {fileGroupButtons()}
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            </Fragment>
        );
    }
    else if (selectedFileId >= 0) {
        return (
            <Fragment>
            {fileGroupButtons()}
            <iframe
                src={pdfUrl}
                title={fileList[selectedFileId].fileName}
                width="100%"
                height={windowDimensions.height - 140}
                style={{ border: 'none' }}
            />
            </Fragment>
        );
    }
    else{
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                No Tender Files!!
            </Box>
        );
    }
};

export default PdfViewComponent;