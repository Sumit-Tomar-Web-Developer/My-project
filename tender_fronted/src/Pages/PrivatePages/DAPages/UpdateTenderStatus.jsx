import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Divider, Grid2, MenuItem, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS, TENDER_GOV_STATUS, YES_NO_OPTIONS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';

export default function UpdateTenderStatus() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    useEffect(() => {
        getBasicDetails();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: ''
    })

    const [tenderDetailsObj, setTenderDetailsObj] = useState({
        govStatus: '',
        technicalSelected: '',
        financialSelected: '',
        tenderAllocatedCompany: '',
        remarks: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        govStatus: '',
        technicalSelected: '',
        financialSelected: '',
        tenderAllocatedCompany: '',
        remarks: ''
    });

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'govStatus':
                if (value.trim() === '') {
                    errorMessage = 'Gov Status is required.';
                }
                break;
            case 'technicalSelected':
                errorMessage = value === '' ? 'Technical Selected is required.' : '';
                break;
            case 'financialSelected':
                errorMessage = value === '' ? 'Financial Selected is required.' : '';
                break;
            case 'tenderAllocatedCompany':
                if (value.trim() === '') {
                    errorMessage = 'Company name to which Tender is allocated is required.';
                }
                break;
            case 'remarks':
                if (value.trim() === '') {
                    errorMessage = 'Remarks is required.';
                }
                break;
            default:
                break;
        }
        setErrorTexts(prevErr => {
            return { ...prevErr, [name]: errorMessage }
        });
        return errorMessage === '';
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'govStatus' && value === 'L1')
        {
            setTenderDetailsObj({ ...tenderDetailsObj, [name]: value, 
                technicalSelected: true, financialSelected: true, 
                tenderAllocatedCompany: 'CPMM' });
        }
        else{
            setTenderDetailsObj({ ...tenderDetailsObj, [name]: value });
        }
        handleValidations(name, value);
    };


    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setBasicDetailsObj({
                        tenderIdText: res.data.data.tenderIdText || ''
                    });
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in getting deatils!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in getting deatils!!");
            }

        });
    }

    const saveGovSelectionDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_GOV_SELECTION}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, tenderDetailsObj)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        navigate('/worklist');
                    } else {
                        toastMessage.error(res.data.message);
                    }
                } else {
                    toastMessage.error('Error in saving data!');
                }
            })
            .catch((error) => {
                if (error.data && error.data.message) {
                    toastMessage.error(error.data.message);
                } else {
                    toastMessage.error('Error in saving data!');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onhandleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all fields in tenderDetailsObj
        Object.keys(tenderDetailsObj).forEach((key) => {
            if (!handleValidations(key, tenderDetailsObj[key])) {
                isValid = false;
            }
        });


        if (isValid) {
            saveGovSelectionDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Update Tender Status' />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="tenderId"
                                    label="Project ID"
                                    name="tenderId"
                                    value={projectId}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="tenderIdText"
                                    label="Tender ID"
                                    name="tenderIdText"
                                    value={basicDetailsObj.tenderIdText}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Divider>Goverment Tender Status</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    fullWidth
                                    disabled={tenderDetailsObj.govStatus === "L1"}
                                    id="technicalSelected"
                                    label="Technical Selected"
                                    name="technicalSelected"
                                    value={tenderDetailsObj.technicalSelected}
                                    onChange={onHandleChange}
                                    error={errorTexts.technicalSelected !== ''}
                                    helperText={errorTexts.technicalSelected}
                                >
                                    {YES_NO_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    fullWidth
                                    disabled={tenderDetailsObj.govStatus === "L1"}
                                    id="financialSelected"
                                    label="Financial Selected"
                                    name="financialSelected"
                                    value={tenderDetailsObj.financialSelected}
                                    onChange={onHandleChange}
                                    error={errorTexts.financialSelected !== ''}
                                    helperText={errorTexts.financialSelected}
                                >
                                    {YES_NO_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    fullWidth
                                    id="govStatus"
                                    label="Tender Status"
                                    name="govStatus"
                                    value={tenderDetailsObj.govStatus}
                                    onChange={onHandleChange}
                                    error={errorTexts.govStatus !== ''}
                                    helperText={errorTexts.govStatus}
                                >
                                    {TENDER_GOV_STATUS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    disabled={tenderDetailsObj.govStatus === "L1"}
                                    id="tenderAllocatedCompany"
                                    label="Company Name to which Tender Allocated"
                                    name="tenderAllocatedCompany"
                                    value={tenderDetailsObj.tenderAllocatedCompany}
                                    onChange={onHandleChange}
                                    error={errorTexts.tenderAllocatedCompany !== ''}
                                    helperText={errorTexts.tenderAllocatedCompany}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    id="remarks"
                                    label="Remarks"
                                    name="remarks"
                                    multiline
                                    rows={4}
                                    value={tenderDetailsObj.remarks}
                                    onChange={onHandleChange}
                                    error={errorTexts.remarks !== ''}
                                    helperText={errorTexts.remarks}
                                />
                            </Grid2>
                        </Grid2>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CustomButton
                        variant="contained"
                        endIcon={<SaveIcon />}
                        onClick={onhandleSave}
                        color="success"
                        loading={isLoading}
                    >
                        Submit
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}