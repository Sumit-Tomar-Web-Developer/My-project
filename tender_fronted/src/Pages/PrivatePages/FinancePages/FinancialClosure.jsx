import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Divider, Grid2, MenuItem, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS, YES_NO_OPTIONS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';

export default function FinancialClosure() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    useEffect(() => {
        getBasicDetails();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: '',
        location: ''
    })

    const [finClosureDetailsObj, setFinClosureDetailsObj] = useState({
        emdAmountReceived: '',
        sdAmountReceived: '',
        comments: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        emdAmountReceived: '',
        sdAmountReceived: '',
        comments: ''
    });

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'emdAmountReceived':
                errorMessage = value.trim() === '' ? 'EMD Amount Received is required.' : '';
                break;
            case 'sdAmountReceived':
                errorMessage = value.trim() === '' ? 'SD Amount Received is required.' : '';
                break;
            case 'comments':
                errorMessage = value.trim() === '' ? 'Comment is required.' : '';
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
        setFinClosureDetailsObj({ ...finClosureDetailsObj, [name]: value });
        handleValidations(name, value);
    };

    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setBasicDetailsObj({
                        tenderIdText: res.data.data.tenderIdText || '',
                        location: res.data.data.location || '',
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

    const saveFinClosureDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_FIN_CLOSURE}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, finClosureDetailsObj)
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

        // Validate all fields in finClosureDetailsObj
        Object.entries(finClosureDetailsObj).forEach(([key, value]) => {
            if (!handleValidations(key, value)) {
                isValid = false;
            }
        });

        if (isValid) {
            saveFinClosureDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Financial Closure' />
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
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="location"
                                    label="Location"
                                    name="location"
                                    value={basicDetailsObj.location}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Divider>Financial Closure Details</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    select
                                    id="emdAmountReceived"
                                    label="EMD Amount Received"
                                    name="emdAmountReceived"
                                    value={finClosureDetailsObj.emdAmountReceived}
                                    onChange={onHandleChange}
                                    error={errorTexts.emdAmountReceived !== ''}
                                    helperText={errorTexts.emdAmountReceived}
                                >
                                    {YES_NO_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    select
                                    id="sdAmountReceived"
                                    label="SD Amount Received"
                                    name="sdAmountReceived"
                                    value={finClosureDetailsObj.sdAmountReceived}
                                    onChange={onHandleChange}
                                    error={errorTexts.sdAmountReceived !== ''}
                                    helperText={errorTexts.sdAmountReceived}
                                >
                                    {YES_NO_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 6 }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="comments"
                                    label="Comments"
                                    name="comments"
                                    value={finClosureDetailsObj.comments}
                                    onChange={onHandleChange}
                                    error={errorTexts.comments !== ''}
                                    helperText={errorTexts.comments}
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
                        Submit Financial Closure
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}