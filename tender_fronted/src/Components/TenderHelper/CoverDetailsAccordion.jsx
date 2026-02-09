import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Grid2, IconButton, MenuItem, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CustomAccordion from '../Common/CustomAccordion';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, COVER_DOC_TYPES, COVER_TYPES } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';

export default function CoverDetailsAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const [coverDetailsObj, setCoverDetailsObj] = React.useState({
        docsDict: { list: [{ coverNo: '', cover: '', docType: '', docDesp: '' }] },
    });

    const [errorTexts, setErrorTexts] = React.useState({
        docsDict: { list: [{ coverNo: '', cover: '', docType: '', docDesp: '' }] },
    });

    useEffect(() => {
        getCoverDetails();
    }, []);

    const handleValidations = (name, value, index) => {
        let errorMessage = '';
        switch (name) {
            case 'coverNo':
                if (value === '') {
                    errorMessage = 'Cover Number is required.';
                } else if (!/^[0-9]\d*$/.test(value)) {
                    errorMessage = 'Cover Number must be a positive number.';
                }
                break;
            case 'cover':
                errorMessage = value.trim() === '' ? 'Cover is required.' : '';
                break;
            case 'docType':
                errorMessage = value.trim() === '' ? 'Document Type is required.' : '';
                break;
            case 'docDesp':
                errorMessage = value.trim() === '' ? 'Document Description is required.' : '';
                break;
            default:
                break;
        }

        const updatedDocListErrors = [...errorTexts.docsDict.list];
        updatedDocListErrors[index][name] = errorMessage;
        setErrorTexts((prev) => ({ ...prev, docsDict: { list: updatedDocListErrors } }));

        return errorMessage === '';
    };

    const handleChangeList = (e, index) => {
        const { name, value } = e.target;
        const updatedDocList = [...coverDetailsObj.docsDict.list];
        updatedDocList[index][name] = value;
        setCoverDetailsObj({ ...coverDetailsObj, docsDict: { list: updatedDocList } });
        handleValidations(name, value, index);
    };

    const handleAddToList = () => {
        const updatedDocList = [...coverDetailsObj.docsDict.list, { coverNo: '', cover: '', docType: '', docDesp: '' }];
        const updatedErrorList = [...errorTexts.docsDict.list, { coverNo: '', cover: '', docType: '', docDesp: '' }];
        setCoverDetailsObj({ ...coverDetailsObj, docsDict: { list: updatedDocList } });
        setErrorTexts({ ...errorTexts, docsDict: { list: updatedErrorList } });
    };

    const handleDeleteFromList = (index) => {
        const updatedDocList = [...coverDetailsObj.docsDict.list];
        const updatedErrorList = [...errorTexts.docsDict.list];
        updatedDocList.splice(index, 1);
        updatedErrorList.splice(index, 1);
        setCoverDetailsObj({ ...coverDetailsObj, docsDict: { list: updatedDocList } });
        setErrorTexts({ ...errorTexts, docsDict: { list: updatedErrorList } });
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handlePanelChange(panelIndex - 1);
    };

    const getCoverDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_COVER_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setCoverDetailsObj({
                        coverNo: res.data.data.coverNo || '',
                        docsDict: {
                            list: res.data.data.docsDict.list.map((doc) => ({
                                coverNo: doc.coverNo,
                                cover: doc.cover || '',
                                docType: doc.docType || '',
                                docDesp: doc.docDesp || '',
                            })),
                        },
                    });
                    setErrorTexts({
                        docsDict: {
                            list: res.data.data.docsDict.list.map(() => ({
                                coverNo: '',
                                cover: '',
                                docType: '',
                                docDesp: '',
                            })),
                        },
                    })
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error('Error in fetching data!!');
            }
        }).catch((error) => {
            // To handle if data is not saved yet and user is trying to edit the data
            if (isedit && error.status === 404) {
                return;
            }
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {
                toastMessage.error('Error in fetching data!!');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const saveCoverDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_COVER_DETAILS}`;

        setIsLoading(true);
        postRequest(baseTenderUrl, coverDetailsObj).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    toastMessage.success(res.data.message);
                    handlePanelChange(panelIndex + 1);
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error('Error in saving data!!');
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {
                toastMessage.error('Error in saving data!!');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleSaveLater = (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate `docList`
        coverDetailsObj.docsDict.list.map((doc, index) => {
            Object.entries(doc).map(([key, val]) => {
                if (!handleValidations(key, val, index)) {
                    isValid = false;
                }
            })
        });

        // If all validations pass, save the data
        if (isValid) {
            saveCoverDetails();
        }
    };

    return (
        <CustomAccordion
            isedit={isedit}
            panelIndex={panelIndex}
            handleSaveLater={handleSaveLater}
            handleBackClick={handleBackClick}
            isLoading={isLoading}
        >
            <Grid2 container spacing={2}>
                {coverDetailsObj.docsDict.list.map((docObj, index) => (
                    <React.Fragment key={index}>
                        <Grid2 size={{ xs: 12, sm: 4, md: 2 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="coverNo"
                                label="Cover No"
                                name="coverNo"
                                value={docObj.coverNo}
                                onChange={(e) => handleChangeList(e, index)}
                                error={errorTexts.docsDict.list[index]?.coverNo !== ''}
                                helperText={errorTexts.docsDict.list[index]?.coverNo}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 8.5 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                select
                                required
                                fullWidth
                                id="cover"
                                label="Cover"
                                name="cover"
                                value={docObj.cover}
                                onChange={(e) => handleChangeList(e, index)}
                                error={errorTexts.docsDict.list[index]?.cover !== ''}
                                helperText={errorTexts.docsDict.list[index]?.cover}
                            >
                                {Object.values(COVER_TYPES).map((cov) => (
                                    <MenuItem key={cov.value} value={cov.name}>
                                        {cov.name}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 3, md: 2 }}>
                            <CustomTextField
                                isedit={isedit}
                                select
                                size="small"
                                required
                                fullWidth
                                id="docType"
                                label="Document Type"
                                name="docType"
                                value={docObj.docType}
                                onChange={(e) => handleChangeList(e, index)}
                                error={errorTexts.docsDict.list[index]?.docType !== ''}
                                helperText={errorTexts.docsDict.list[index]?.docType}
                            >
                                 {Object.values(COVER_DOC_TYPES).map((cov) => (
                                    <MenuItem key={cov.value} value={cov.name}>
                                        {cov.name}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 8.5 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                required
                                fullWidth
                                id="docDesp"
                                label="Document Description"
                                name="docDesp"
                                value={docObj.docDesp}
                                onChange={(e) => handleChangeList(e, index)}
                                error={errorTexts.docsDict.list[index]?.docDesp !== ''}
                                helperText={errorTexts.docsDict.list[index]?.docDesp}
                            />
                        </Grid2>
                        {isedit &&
                            <Grid2 size={{ xs: 12, sm: 3, md: 1.5 }}  style={{ marginBottom: '2em' }}>
                                <Stack direction="row" spacing={1}>
                                    {coverDetailsObj.docsDict.list.length > 1 && (
                                        <IconButton color="primary" onClick={() => handleDeleteFromList(index)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                    {index === coverDetailsObj.docsDict.list.length - 1 && (
                                        <IconButton color="primary" onClick={handleAddToList}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Grid2>
                        }
                    </React.Fragment>
                ))}
            </Grid2>
        </CustomAccordion>
    );
}

CoverDetailsAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};