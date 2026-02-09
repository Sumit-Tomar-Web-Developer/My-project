import React, { useEffect, } from 'react';
import { FormHelperText, Grid, Typography, } from '@mui/material';
import { Stack } from '@mui/system';
import MainCard from 'components/MainCard';
import UploadSingleFile from 'components/third-party/dropzone/SingleFile';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { setPropertyImageMast } from '../../../state/reducers/ExistingPropertySlice';
import { convertPlanImg } from 'services/assessmentService/DataEntryService/dataEntryService';

// Convert file to base64
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // if (!(file instanceof Blob)) {
    //   reject('The provided object is not a valid file.');
    // }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
export const convertWMFToSVG = async (Plan) => {
  // 1️⃣ Skip if nothing
  if (!Plan) return null;

  // 2️⃣ If preview/base64 URL is already available (string)
  if (typeof Plan === "string") {
    console.log("Preview exists, skipping WMF conversion:", Plan);
    return Plan; // return as-is
  }

  // 3️⃣ Must be a File to convert
  if (!(Plan instanceof File)) {
    console.warn("convertWMFToSVG called with non-file:", Plan);
    return Plan; // fallback
  }

  // 4️⃣ Convert WMF → Base64 → PNG/SVG
  const img = await convertFileToBase64(Plan);
  console.log("WMF file converted to base64:", img);
  const result = await convertPlanImg(img);

  console.log("Converted image:", result);
  return result.data.png;  // or result.data.svg if needed
};


export default function UploadPhotoAndPlan() {
  const propertyImageMast = useSelector((state) => state.combinedDataEntry.combinedData.propertyImageMast);
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = React.useState({
    files: {
      PropertyPathA: [],
      PropertyPathB: [],
      PropertyPathC: [],
      PropertyPathD: [],
      PlanPath: []
    }
  });

  // Validation schema for the form
  const validationSchema = yup.object().shape({
    files: yup
      .object()
      .test('at-least-one-file', 'At least one file must be uploaded.', (files) =>
        Object.values(files).some((file) => file !== null && file.length > 0)
      )
  });

  useEffect(() => {
    console.log('Property Image Mast:', propertyImageMast);
    if (!propertyImageMast) return;

    const updatedFiles = {};
    const keys = ['PropertyPathA', 'PropertyPathB', 'PropertyPathC', 'PropertyPathD', 'PlanPath'];

    keys.forEach((key) => {
      const base64 = propertyImageMast[key];
      if (typeof base64 === 'string' && base64.startsWith('data:image')) {
        updatedFiles[key] = [{ preview: base64 }];
      } else if (Array.isArray(base64)) {
        updatedFiles[key] = base64;
      }
    });

    setImageFiles({ files: updatedFiles });


  }, []);
  const formikRef = React.useRef();
  useEffect(() => {
    console.log('Image Files State:', imageFiles);
  }, [imageFiles]);
  useEffect(() => {
    if (!propertyImageMast) return;

    const updatedFiles = {};
    const keys = ['PropertyPathA', 'PropertyPathB', 'PropertyPathC', 'PropertyPathD', 'PlanPath'];

    keys.forEach((key) => {
      const base64 = propertyImageMast[key];
      if (typeof base64 === 'string' && base64.startsWith('data:image')) {
        updatedFiles[key] = [{ preview: base64 }];
      } else if (Array.isArray(base64)) {
        updatedFiles[key] = base64;
      } else {
        updatedFiles[key] = []; // fallback in case of missing data
      }
    });

    // Update local state
    setImageFiles({ files: updatedFiles });

    // 💡 NEW: Sync it to Formik as well
    setTimeout(() => {
      formikRef?.current?.setValues({ files: updatedFiles });
    }, 0);
  }, [propertyImageMast]);
  const [hoverActive, setHoverActive] = React.useState({
    PropertyPathA: false,
    PropertyPathB: false,
    PropertyPathC: false,
    PropertyPathD: false,
    PlanPath: false,
  });
  const hoverTimers = React.useRef({});

  const handleMouseEnter = (key) => {
    hoverTimers.current[key] = setTimeout(() => {
      setHoverActive((prev) => ({ ...prev, [key]: true }));
    }, 1000); // 1s delay
  };

  const handleMouseLeave = (key) => {
    clearTimeout(hoverTimers.current[key]);
    setHoverActive((prev) => ({ ...prev, [key]: false })); // immediate reset
  };

  return (
    <MainCard title="Upload Files">
      <Formik
        innerRef={formikRef}
        initialValues={imageFiles}
        enableReinitialize={false}
        onSubmit={(values) => {
          console.log(values, 'values');
        }}
      >
        {({ values, setFieldValue, touched, errors }) => {


          return (
            <form>
              <Grid container spacing={3}>
                {/* Left Side: A, B on top | C, D on bottom */}
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    {/* Top Row: A & B */}
                    {['PropertyPathA', 'PropertyPathB'].map((fileKey, index) => {
                      const backendImageKey = `PropertyPhoto${fileKey}`;
                      return (
                        <Grid item xs={12} sm={6} key={fileKey}>
                          <Stack spacing={1.5} alignItems="center"
                            onMouseEnter={() => handleMouseEnter(backendImageKey)}
                            onMouseLeave={() => handleMouseLeave(backendImageKey)}
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              transformOrigin: 'left top',
                              transition: 'transform 0.1s ease',
                              transform: hoverActive[backendImageKey] ? 'scale(2) translateX(10%)' : 'scale(1) translateX(0)',
                              zIndex: hoverActive[backendImageKey] ? 10 : 'auto',
                              position: 'relative', // ← make zIndex work
                            }}
                          >
                            <UploadSingleFile
                              label={fileKey === 'PropertyPathA' ? 'A' : 'B'}
                              file={values.files?.[fileKey] || []}
                              setFieldValue={(field, file) => {
                                if (file?.length) {
                                  const uploadedFile = file[0];

                                  const blobUrl = URL.createObjectURL(uploadedFile);
                                  const previewObj = [{ preview: blobUrl }];

                                  // 1. Set Formik value (only preview URL for instant UI update)
                                  setFieldValue(`files.${fileKey}`, previewObj);

                                  // 2. Convert to base64 and update local state + Redux
                                  convertFileToBase64(uploadedFile).then((base64) => {
                                    const base64Preview = [{ preview: base64 }];

                                    // Update local state
                                    setImageFiles((prev) => ({
                                      ...prev,
                                      files: {
                                        ...prev.files,
                                        [fileKey]: base64Preview
                                      }
                                    }));

                                    // Update Redux
                                    dispatch(setPropertyImageMast({
                                      ...propertyImageMast,
                                      [fileKey]: base64
                                    }));
                                  });
                                } else {
                                  setFieldValue(`files.${fileKey}`, []);
                                  setImageFiles((prev) => ({
                                    ...prev,
                                    files: {
                                      ...prev.files,
                                      [fileKey]: []
                                    }
                                  }));
                                  dispatch(setPropertyImageMast({
                                    ...propertyImageMast,
                                    [fileKey]: ''
                                  }));
                                }
                              }}
                              error={touched.files?.[fileKey] && !!errors.files?.[fileKey]}
                              sx={{
                                width: '100%',
                                height: '100%',
                                transition: 'transform 0.3s ease, z-index 0.3s ease',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transformOrigin: 'left top',
                              }}
                            />
                          </Stack>
                          {touched.files?.[fileKey] && errors.files?.[fileKey] && (
                            <FormHelperText error>{errors.files[fileKey]}</FormHelperText>
                          )}
                        </Grid>
                      );
                    })}

                    {/* Bottom Row: C & D */}
                    {['PropertyPathC', 'PropertyPathD'].map((fileKey, index) => {
                      const backendImageKey = `PropertyPhoto${fileKey}`;
                      return (
                        <Grid item xs={12} sm={6} key={fileKey}>
                          <Stack spacing={1.5} alignItems="center"
                            onMouseEnter={() => handleMouseEnter(backendImageKey)}
                            onMouseLeave={() => handleMouseLeave(backendImageKey)}
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              transformOrigin: 'left bottom',
                              transition: 'transform 0.1s ease',
                              transform: hoverActive[backendImageKey] ? 'scale(2) translateX(10%)' : 'scale(1) translateX(0)',
                              zIndex: hoverActive[backendImageKey] ? 10 : 'auto',
                              position: 'relative', // ← make zIndex work
                            }}
                          >
                            <UploadSingleFile
                              label={fileKey === 'PropertyPathC' ? 'C' : 'D'}
                              file={values.files?.[fileKey] || []}
                              fileKey={fileKey}
                              setFieldValue={(field, file) => {
                                if (file?.length && file[0] instanceof File) {
                                  const uploadedFile = file[0];

                                  try {
                                    const blobUrl = URL.createObjectURL(uploadedFile);
                                    const previewObj = [{ preview: blobUrl }];

                                    // 1. Set Formik value (only preview URL for instant UI update)
                                    setFieldValue(`files.${fileKey}`, previewObj);

                                    // 2. Convert to base64 and update local state + Redux
                                    convertFileToBase64(uploadedFile).then((base64) => {
                                      const base64Preview = [{ preview: base64 }];

                                      // Update local state
                                      setImageFiles((prev) => ({
                                        ...prev,
                                        files: {
                                          ...prev.files,
                                          [fileKey]: base64Preview
                                        }
                                      }));

                                      // Update Redux
                                      dispatch(setPropertyImageMast({
                                        ...propertyImageMast,
                                        [fileKey]: base64
                                      }));
                                    });
                                  } catch (err) {
                                    console.error('Failed to create object URL:', err);
                                  }
                                } else {
                                  // If file cleared or invalid
                                  setFieldValue(`files.${fileKey}`, []);
                                  setImageFiles((prev) => ({
                                    ...prev,
                                    files: {
                                      ...prev.files,
                                      [fileKey]: []
                                    }
                                  }));
                                  dispatch(setPropertyImageMast({
                                    ...propertyImageMast,
                                    [fileKey]: ''
                                  }));
                                }
                              }}
                              error={touched.files?.[fileKey] && !!errors.files?.[fileKey]}
                              sx={{
                                width: '100%',
                                height: '100%',
                                transition: 'transform 0.3s ease, z-index 0.3s ease',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transformOrigin: 'left top',
                              }}
                            />
                          </Stack>
                          {touched.files?.[fileKey] && errors.files?.[fileKey] && (
                            <FormHelperText error>{errors.files[fileKey]}</FormHelperText>
                          )}
                        </Grid>
                      );
                    })}

                  </Grid>
                </Grid>

                {/* Right Side: Plan Photo full size */}
                <Grid
                  item xs={12} sm={6} >
                  <Stack spacing={1.5} alignItems="center"
                    onMouseEnter={() => handleMouseEnter('Plan')}
                    onMouseLeave={() => handleMouseLeave('Plan')}
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transformOrigin: 'right bottom',
                      transition: 'transform 0.1s ease',
                      transform: hoverActive['Plan'] ? 'scale(1.5) translateX(-10%)' : 'scale(1) translateX(0)',
                      zIndex: hoverActive['Plan'] ? 10 : 'auto',
                      position: 'relative', // ← make zIndex work
                    }}
                  >
                    <UploadSingleFile

                      label="Plan"
                      file={values.files?.PlanPath || []}
                      setFieldValue={(field, file) => {
                        if (file?.length) {
                          const uploadedFile = file[0];

                          const blobUrl = URL.createObjectURL(uploadedFile);
                          const previewObj = [{ preview: blobUrl }];

                          
                        
                          convertWMFToSVG(uploadedFile).then((base64) => {
 
                            console.log("Converted Plan image to base64:", base64);
                            const base64Preview = [{ preview: base64 }];

                            setImageFiles((prev) => ({
                              ...prev,
                              files: {
                                ...prev.files,
                                PlanPath: base64Preview
                              }
                            }));

                            dispatch(setPropertyImageMast({
                              ...propertyImageMast,
                              PlanPath: base64
                            }));
                          });
                        } else {
                          setFieldValue('files.PlanPath', []);
                          setImageFiles((prev) => ({
                            ...prev,
                            files: {
                              ...prev.files,
                              PlanPath: []
                            }
                          }));
                          dispatch(setPropertyImageMast({
                            ...propertyImageMast,
                            PlanPath: ''
                          }));
                        }
                      }}
                      error={touched.files?.PhotoPlan && !!errors.files?.PhotoPlan}
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',


                      }}
                    />
                    {touched.files?.PhotoPlan && errors.files?.PhotoPlan && (
                      <FormHelperText error>{errors.files.PhotoPlan}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </MainCard >
  );
}