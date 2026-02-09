import { useState, useEffect } from "react";
import {
    TextField,
    Grid2,
    Paper,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';

import { API_STATUS, EXPENSE_STATUS, TENDER_STATUS, USER_ROLES } from "../../Utils/Constants";
import { getExpenseSearchFiltersApi, getSearchFiltersApi } from "../../AppApis/ApiFunctions";
import { useToast } from "../../Providers/ToastProvider";
import { useAuth } from "../../Providers/AuthProvider";
import CustomButton from "./CustomButton";


export default function CustomTableSearch(props) {
    const { user } = useAuth();
    const { toastMessage } = useToast();

    const [departmentId, setDepartmentId] = useState("");
    const [location, setLocation] = useState("");
    const [tenderId, setTenderId] = useState("");

    const [inputDepartmentId, setInputDepartmentId] = useState("");
    const [inputLoc, setInputLoc] = useState("");
    const [inputTenderId, setInputTenderId] = useState("");

    const [locTenderMap, setLocTenderMap] = useState({});

    const [locationList, setLocationList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [tenderIdList, setTenderIdList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchFilters();
    }, [])

    useEffect(() => {
        setDepartmentId("");
        setLocation("");
        setTenderId("");

        setInputDepartmentId("");
        setInputLoc("");
        setInputTenderId("");

        setLocTenderMap({});
        setLocationList([]);
        setDepartmentList([]);
        setTenderIdList([]);

        fetchFilters();
    }, [props.filterType]);

    const isFilteredValue = (currStatus) => {
        let isValid = false;
        switch (props.filterType) {
            case 'all':
                isValid = true;
                break;
            case 'worklist':
                for (let key in TENDER_STATUS) {
                    if (TENDER_STATUS[key].id === currStatus && TENDER_STATUS[key].access[user.role]) {
                        isValid = true;
                        break;
                    }
                }
                break;
            case 'expenseAll':
                isValid = true;
                break;
            case 'expenseWorklist':
                for (let key in EXPENSE_STATUS) {
                    if (EXPENSE_STATUS[key].id === currStatus && EXPENSE_STATUS[key].access[user.role]) {
                        isValid = true;
                        break;
                    }
                }
                break;
            case 'corrigendum':
                if (currStatus !== TENDER_STATUS.Draft.id) {
                    isValid = true;
                }
                break;
            default:
                break;
        }
        return isValid;
    }

    const getFilteredMap = (locTenderMap) => {
        let filteredLocTenderMap = {};
        //  filterMap: { department1: { name: departmentName1, locDict: {location1 : {tenderId: currentStatus, ....} ... } ...} ...}
        Object.entries(locTenderMap).forEach(([dep, depdict]) => {
            Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                Object.entries(tdict).forEach(([tId, currStatus]) => {
                    let isValid = isFilteredValue(currStatus);
                    if (isValid) {
                        if (!(dep in filteredLocTenderMap)) {
                            filteredLocTenderMap[dep] = { name: depdict.name, locDict: {} };
                        }
                        if (!(loc in filteredLocTenderMap[dep]['locDict'])) {
                            filteredLocTenderMap[dep]['locDict'][loc] = {};
                        }
                        if (!(tId in filteredLocTenderMap[dep]['locDict'][loc])) {
                            filteredLocTenderMap[dep]['locDict'][loc][tId] = currStatus;
                        }
                    }
                })
            })
        })

        return filteredLocTenderMap;
    }

    // Fetch filters from API
    const fetchFilters = () => {
        setIsLoading(true);
        let searchApi = getSearchFiltersApi;
        if (props.filterType === "expenseAll" || props.filterType === "expenseWorklist") {
            searchApi = getExpenseSearchFiltersApi;
        }
        searchApi({}).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    // In fetchLocations, after setfilterMap:
                    if (res.data.data.filterMap) {
                        //  filterMap: { department1: { name: departmentName1, locDict: {location1 : {tenderId: currentStatus, ....} ... } ...} ...}
                        let filteredMap = getFilteredMap(res.data.data.filterMap);
                        setLocTenderMap(filteredMap);
                        let allDepartments = [];
                        let allLocations = [];
                        let allTenderIds = [];

                        Object.entries(filteredMap).map(([dep, depdict]) => {
                            allDepartments.push({ name: depdict.name, value: dep });
                            Object.entries(depdict.locDict).map(([loc, tdict]) => {
                                allLocations.push(loc);
                                Object.keys(tdict).map((tId) => {
                                    allTenderIds.push(tId);
                                })
                            })
                        })

                        allLocations = allLocations.sort();
                        allDepartments = allDepartments.sort();
                        allTenderIds = allTenderIds.sort();
                        setLocationList(allLocations);
                        setDepartmentList(allDepartments);
                        setTenderIdList(allTenderIds);
                    }
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Location List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Location List!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const onHandleChange = (name, newValue) => {
        let allLocations = [];
        let allTenderIds = [];
        switch (name) {
            case "departmentId":
                setLocation('');
                setTenderId('');
                if (!newValue) {
                    setDepartmentId('');
                    Object.values(locTenderMap).map((depdict) => {
                        Object.entries(depdict.locDict).map(([loc, tdict]) => {
                            allLocations.push(loc);
                            Object.keys(tdict).map((tId) => {
                                allTenderIds.push(tId);
                            })
                        })
                    })
                }
                else {
                    Object.entries(locTenderMap).map(([dep, depdict]) => {
                        if (dep === newValue.value) {
                            setDepartmentId(dep);
                            Object.entries(depdict.locDict).map(([loc, tdict]) => {
                                allLocations.push(loc);
                                Object.keys(tdict).map((tId) => {
                                    allTenderIds.push(tId);
                                })
                            })
                        }
                    })
                }
                allLocations = allLocations.sort();
                allTenderIds = allTenderIds.sort();
                setLocationList(allLocations);
                setTenderIdList(allTenderIds);
                break;
            case "location":
                setTenderId('');
                if (!newValue) {
                    setLocation('');
                    Object.values(locTenderMap).map((depdict) => {
                        Object.values(depdict.locDict).map((tdict) => {
                            Object.keys(tdict).map((tId) => {
                                allTenderIds.push(tId);
                            })
                        })
                    })
                }
                else {
                    Object.values(locTenderMap).map((depdict) => {
                        Object.entries(depdict.locDict).map(([loc, tdict]) => {
                            if (loc === newValue) {
                                setLocation(newValue);
                                Object.keys(tdict).map((tId) => {
                                    allTenderIds.push(tId);
                                })
                            }
                        })
                    })
                }

                allTenderIds = allTenderIds.sort();
                setTenderIdList(allTenderIds);
                break;
            case "tenderId":
                setTenderId(newValue);
                break;
            default:
                console.log("Invalid name in onHandleChange: " + name);
                break;
        };
    }

    const handleSearch = (e) => {
        e.preventDefault();
        props.handleSearch(departmentId, location, tenderId);
    }

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <Grid2 container spacing={2}>
                {user.role === USER_ROLES.MD.id && (
                    <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                        <Autocomplete
                            disablePortal
                            // value={departmentId}
                            inputValue={inputDepartmentId}
                            onChange={(e, newVal) => onHandleChange('departmentId', newVal)}
                            onInputChange={(event, newInputValue) => {
                                setInputDepartmentId(newInputValue);
                            }}
                            size="small"
                            id="departmentId"
                            fullWidth
                            options={departmentList}
                            getOptionLabel={(dep) => dep.name || ''}
                            isOptionEqualToValue={(dep, value) => dep.value === value.value}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    size="small"
                                    label="Department"
                                />}
                        />
                    </Grid2>
                )}
                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                    <Autocomplete
                        disablePortal
                        value={location}
                        inputValue={inputLoc}
                        onChange={(e, newVal) => onHandleChange('location', newVal)}
                        onInputChange={(event, newInputValue) => {
                            setInputLoc(newInputValue);
                        }}
                        size="small"
                        id="location"
                        fullWidth
                        options={locationList}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                size="small"
                                label="Location"
                            />}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
                    <Autocomplete
                        disablePortal
                        value={tenderId}
                        inputValue={inputTenderId}
                        onChange={(e, newVal) => onHandleChange('tenderId', newVal)}
                        onInputChange={(event, newInputValue) => {
                            setInputTenderId(newInputValue);
                        }}
                        size="small"
                        id="tenderId"
                        fullWidth
                        getOptionLabel={(option) => String(option) || ""}
                        options={tenderIdList}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                size="small"
                                label="Project ID"
                            />}
                    />
                </Grid2>
                <Grid2
                    size={user.role === USER_ROLES.MD.id ? { xs: 12, sm: 6, md: 3, lg: 6 } : { xs: 12, sm: 12, md: 6, lg: 8 }}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CustomButton
                        id="search_user_button"
                        onClick={handleSearch}
                        variant="contained"
                        position="end"
                        endIcon={<SearchIcon fontSize="size" />}
                        loading={isLoading}
                        color="secondary"
                    >
                        Search
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Paper>
    );
};
