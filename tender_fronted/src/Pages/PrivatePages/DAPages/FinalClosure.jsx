import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Divider, Grid2, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';

export default function FinalClosure() {
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


    const [finalClosureDetailsObj, setFinalClosureDetailsObj] = useState({
        closureRemark: '',
        lessonsLearnt: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        closureRemark: '',
        lessonsLearnt: ''
    });

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'closureRemark':
                errorMessage = value.trim() === '' ? 'Closure Remark is required.' : '';
                break;
            case 'lessonsLearnt':
                errorMessage = value.trim() === '' ? 'Lessons learned is required.' : '';
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
        setFinalClosureDetailsObj({ ...finalClosureDetailsObj, [name]: value });
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

    const saveFinalClosureDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_FINAL_CLOSURE}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, finalClosureDetailsObj)
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

        // Validate all fields in finalClosureDetailsObj
        Object.entries(finalClosureDetailsObj).forEach(([key, value]) => {
            if (!handleValidations(key, value)) {
                isValid = false;
            }
        });

        if (isValid) {
            saveFinalClosureDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Project Closure' />
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
                                <Divider>Final Closure Details</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="closureRemark"
                                    label="Closure Remark"
                                    name="closureRemark"
                                    value={finalClosureDetailsObj.closureRemark}
                                    onChange={onHandleChange}
                                    error={errorTexts.closureRemark !== ''}
                                    helperText={errorTexts.closureRemark}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="lessonsLearnt"
                                    label="Lessons Learned"
                                    name="lessonsLearnt"
                                    value={finalClosureDetailsObj.lessonsLearnt}
                                    onChange={onHandleChange}
                                    error={errorTexts.lessonsLearnt !== ''}
                                    helperText={errorTexts.lessonsLearnt}
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
                        Submit Final Closure
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}