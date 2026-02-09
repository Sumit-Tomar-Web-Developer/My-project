import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    MenuItem,
    Grid2,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    FormControl, InputLabel, Select,
    Divider,
    Link
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { getSearchFiltersApi, getTenderMonitorReportApi } from '../../../AppApis/ApiFunctions';
import { TENDER_STATUS, API_STATUS, USER_ROLES } from '../../../Utils/Constants';
import CustomButton from '../../../Components/Common/CustomButton';
import { useToast } from "../../../Providers/ToastProvider";
import { useAuth } from "../../../Providers/AuthProvider";
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import { formatDateForTable } from '../../../Utils/UtilityFunctions';


const TenderMonitorReportPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const { toastMessage } = useToast();

    // Filter state
    const [filters, setFilters] = useState({
        departmentId: '',
        location: '',
        tenderId: '',
        tenderStatusId: '',
        createdAtStart: '',
        createdAtEnd: '',
    });

    // Autocomplete input states
    const [inputDepartmentId, setInputDepartmentId] = useState("");
    const [inputLoc, setInputLoc] = useState("");
    const [inputTenderId, setInputTenderId] = useState("");

    // Data lists
    const [locTenderMap, setLocTenderMap] = useState({});
    const [locationList, setLocationList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [tenderIdList, setTenderIdList] = useState([]);

    // Table data
    const [loading, setLoading] = useState(false);

    // Fetch filters on mount
    useEffect(() => {
        fetchFilters();
        let tenderId = searchParams.get('tenderId');
        setSearchParams({});
        let newFilters = { ...filters };
        if (user.role === USER_ROLES.MD.id) {
            newFilters = { ...newFilters, tenderId: tenderId || '' };
        }
        else {
            newFilters = { ...newFilters, departmentId: user.department, tenderId: tenderId || '' };
            setInputDepartmentId(user.department);
        }
        setFilters(newFilters);
        setInputTenderId(tenderId || '');
        fetchReport(newFilters);
    }, []);

    // Fetch filter options
    const fetchFilters = () => {
        setLoading(true);
        getSearchFiltersApi({}).then((res) => {
            if (res.data && res.data.type === API_STATUS.SUCCESS && res.data.data.filterMap) {
                let filteredMap = getFilteredMap(res.data.data.filterMap);
                setLocTenderMap(filteredMap);
                let allDepartments = [];
                let allLocations = [];
                let allTenderIds = [];
                Object.entries(filteredMap).forEach(([dep, depdict]) => {
                    allDepartments.push({ name: depdict.name, value: dep });
                    Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                        allLocations.push(loc);
                        Object.keys(tdict).forEach((tId) => {
                            allTenderIds.push(tId);
                        });
                    });
                });
                setLocationList([...new Set(allLocations)].sort());
                setDepartmentList([...allDepartments].sort((a, b) => a.name.localeCompare(b.name)));
                setTenderIdList([...new Set(allTenderIds)].sort());
            } else {
                toastMessage.error(res.data?.message || "Error in Fetching Location List!!");
            }
        }).catch((error) => {
            toastMessage.error(error.data?.message || "Error in Fetching Location List!!");
        }).finally(() => setLoading(false));
    };

    // Helper to normalize filter map
    const getFilteredMap = (locTenderMap) => {
        let filteredLocTenderMap = {};
        Object.entries(locTenderMap).forEach(([dep, depdict]) => {
            Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                Object.entries(tdict).forEach(([tId, currStatus]) => {
                    if (!(dep in filteredLocTenderMap)) {
                        filteredLocTenderMap[dep] = { name: depdict.name, locDict: {} };
                    }
                    if (!(loc in filteredLocTenderMap[dep]['locDict'])) {
                        filteredLocTenderMap[dep]['locDict'][loc] = {};
                    }
                    if (!(tId in filteredLocTenderMap[dep]['locDict'][loc])) {
                        filteredLocTenderMap[dep]['locDict'][loc][tId] = currStatus;
                    }
                });
            });
        });
        return filteredLocTenderMap;
    };

    // Handle filter changes for Autocomplete
    const onHandleChange = (name, newValue) => {
        let allLocations = [];
        let allTenderIds = [];
        switch (name) {
            case "departmentId":
                if (!newValue) {
                    setFilters((prev) => ({ ...prev, departmentId: '', location: '', tenderId: '' }));
                    Object.values(locTenderMap).forEach((depdict) => {
                        Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                            allLocations.push(loc);
                            Object.keys(tdict).forEach((tId) => allTenderIds.push(tId));
                        });
                    });
                } else {
                    Object.entries(locTenderMap).forEach(([dep, depdict]) => {
                        if (dep === newValue.value) {
                            setFilters((prev) => ({ ...prev, departmentId: dep, location: '', tenderId: '' }));
                            Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                                allLocations.push(loc);
                                Object.keys(tdict).forEach((tId) => allTenderIds.push(tId));
                            });
                        }
                    });
                }
                setLocationList([...new Set(allLocations)].sort());
                setTenderIdList([...new Set(allTenderIds)].sort());
                break;
            case "location":
                if (!newValue) {
                    setFilters((prev) => ({ ...prev, location: '', tenderId: '' }));
                    Object.values(locTenderMap).forEach((depdict) => {
                        Object.values(depdict.locDict).forEach((tdict) => {
                            Object.keys(tdict).forEach((tId) => allTenderIds.push(tId));
                        });
                    });
                } else {
                    Object.values(locTenderMap).forEach((depdict) => {
                        Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                            if (loc === newValue) {
                                setFilters((prev) => ({ ...prev, location: newValue, tenderId: '' }));
                                Object.keys(tdict).forEach((tId) => allTenderIds.push(tId));
                            }
                        });
                    });
                }
                setTenderIdList([...new Set(allTenderIds)].sort());
                break;
            case "tenderId":
                setFilters((prev) => ({ ...prev, tenderId: newValue }));
                break;
            default:
                break;
        }
    };

    // Handle filter changes for TextField/Select
    const handleFilterChange = (e) => {
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const [tenderRecords, setTenderRecords] = useState([]);
    const [tenderAggData, setTenderAggData] = useState(null);

    const fetchReport = (params) => {
        setLoading(true);
        getTenderMonitorReportApi(params).then((res) => {
            setTenderRecords(res.data.data.records || []);
            setTenderAggData(res.data.data.aggregateddata || null);
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in getting Report!!");
            }
        }).finally(() => setLoading(false));
    };

    return (
        <Box>
            <CustomPageTitle title="Project - Monitor Tender Report" />
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <Grid2 container spacing={2} alignItems="center">
                    {user.role === USER_ROLES.MD.id && (
                        <Grid2 item size={{ xs: 12, sm: 4, md: 2 }}>
                            <Autocomplete
                                disablePortal
                                value={departmentList.find(dep => dep.value === filters.departmentId) || null}
                                inputValue={inputDepartmentId}
                                onChange={(e, newVal) => onHandleChange('departmentId', newVal)}
                                onInputChange={(event, newInputValue) => setInputDepartmentId(newInputValue)}
                                size="small"
                                id="departmentId"
                                options={departmentList}
                                getOptionLabel={(dep) => dep?.name || ''}
                                isOptionEqualToValue={(dep, value) => dep.value === value.value}
                                renderInput={(params) =>
                                    <TextField {...params} size="small" label="Department" />
                                }
                            />
                        </Grid2>
                    )}
                    <Grid2 item size={{ xs: 12, sm: 4, md: 2 }}>
                        <Autocomplete
                            disablePortal
                            value={filters.location || null}
                            inputValue={inputLoc}
                            onChange={(e, newVal) => onHandleChange('location', newVal)}
                            onInputChange={(event, newInputValue) => setInputLoc(newInputValue)}
                            size="small"
                            id="location"
                            options={locationList}
                            getOptionLabel={(option) => option || ""}
                            renderInput={(params) =>
                                <TextField {...params} size="small" label="Location" />
                            }
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 4, md: 2 }}>
                        <Autocomplete
                            disablePortal
                            value={filters.tenderId || null}
                            inputValue={inputTenderId}
                            onChange={(e, newVal) => onHandleChange('tenderId', newVal)}
                            onInputChange={(event, newInputValue) => setInputTenderId(newInputValue)}
                            size="small"
                            id="tenderId"
                            options={tenderIdList}
                            getOptionLabel={(option) => String(option) || ""}
                            renderInput={(params) =>
                                <TextField {...params} size="small" label="Project ID" />
                            }
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 4, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="tender-status-label">Tender Status</InputLabel>
                            <Select
                                labelId="tender-status-label"
                                label="Tender Status"
                                name="tenderStatusId"
                                value={filters.tenderStatusId}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All</MenuItem>
                                {Object.values(TENDER_STATUS).map((status) => (
                                    <MenuItem key={status.id} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 4, md: 2 }}>
                        <TextField
                            label="Created At Start"
                            name="createdAtStart"
                            type="date"
                            value={filters.createdAtStart}
                            onChange={handleFilterChange}
                            fullWidth
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 4, md: 2 }}>
                        <TextField
                            label="Created At End"
                            name="createdAtEnd"
                            type="date"
                            value={filters.createdAtEnd}
                            onChange={handleFilterChange}
                            fullWidth
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid2>
                    <Grid2 item
                        size={user.role === USER_ROLES.MD.id ? { xs: 12, sm: 12, md: 12 } : { xs: 12, sm: 4, md: 2 }}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CustomButton
                            id="fetch_report_button"
                            onClick={() => {
                                fetchReport({ ...filters, page: 0 });
                            }}
                            variant="contained"
                            endIcon={<SearchIcon size="small" />}
                            loading={loading}
                            color="secondary"
                        >
                            Fetch Report
                        </CustomButton>
                    </Grid2>
                </Grid2>
            </Paper>
            {loading ? (
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                </Paper>
            ) : (
                <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Project ID</strong></TableCell>
                                    <TableCell><strong>Tender ID</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Department</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell><strong>Created Date</strong></TableCell>
                                    <TableCell><strong>EMD Amount</strong></TableCell>
                                    <TableCell><strong>Tender Fee</strong></TableCell>
                                    <TableCell><strong>Processing Fee</strong></TableCell>
                                    {/* <TableCell><strong>Publish Date</strong></TableCell>
                                <TableCell><strong>Bid Opening Date</strong></TableCell>
                                <TableCell><strong>Download Start</strong></TableCell>
                                <TableCell><strong>Download End</strong></TableCell>
                                <TableCell><strong>Clarification Start</strong></TableCell>
                                <TableCell><strong>Clarification End</strong></TableCell>
                                <TableCell><strong>Submission Start</strong></TableCell>
                                <TableCell><strong>Submission End</strong></TableCell>
                                <TableCell><strong>Extension Date</strong></TableCell> */}
                                    <TableCell><strong>Bill Submitted</strong></TableCell>
                                    <TableCell><strong>Bill Payment Received</strong></TableCell>
                                    <TableCell><strong>Amount Variance Reason</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tenderRecords.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={20} align="center">
                                            No Tender data found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tenderRecords.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Link
                                                    component="button"
                                                    variant="body2"
                                                    sx={{ textDecoration: "none", color: "secondary.main", fontWeight: "bold" }}
                                                    onClick={() => {
                                                        navigate(`/view_tender_details/${row.id}`);
                                                    }}
                                                >
                                                    Project_{row.id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{row.tenderid}</TableCell>
                                            <TableCell>{row.currentstatus}</TableCell>
                                            <TableCell>{row.department}</TableCell>
                                            <TableCell>{row.location}</TableCell>
                                            <TableCell>{formatDateForTable(row.TenderCreateddate)}</TableCell>
                                            <TableCell>₹{row.emdAmount ? row.emdAmount : 0}</TableCell>
                                            <TableCell>₹{row.tenderFee ? row.tenderFee : 0}</TableCell>
                                            <TableCell>₹{row.processingFee ? row.processingFee : 0}</TableCell>
                                            {/* <TableCell>{formatDateForTable(row.publishDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.bidOpeningDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.downloadStartDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.downloadEndDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.clarificationStartDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.clarificationEndDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.submissionStartDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.submissionEndDate)}</TableCell>
                                        <TableCell>{formatDateForTable(row.extensionDate)}</TableCell> */}
                                            <TableCell>₹{row.billSubmittedAmount ? row.billSubmittedAmount : 0}</TableCell>
                                            <TableCell>₹{row.billPaymentReceived ? row.billPaymentReceived : 0}</TableCell>
                                            <TableCell>{row.amountVarianceReason}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                                <TableRow>
                                    <TableCell colSpan={12} align="center">
                                        <Divider />
                                    </TableCell>
                                </TableRow>
                                {tenderAggData !== null && (
                                    <TableRow>
                                        <TableCell><strong>Total</strong></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <strong>
                                                ₹{tenderAggData.emdAmount ? tenderAggData.emdAmount : 0}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                ₹{tenderAggData.tenderFee ? tenderAggData.tenderFee : 0}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                ₹{tenderAggData.processingFee ? tenderAggData.processingFee : 0}
                                            </strong>
                                        </TableCell>
                                        {/* <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell>
                                     <TableCell></TableCell> */}
                                        <TableCell>
                                            <strong>
                                                ₹{tenderAggData.billSubmittedAmount ? tenderAggData.billSubmittedAmount : 0}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                ₹{tenderAggData.billPaymentReceived ? tenderAggData.billPaymentReceived : 0}
                                            </strong>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

export default TenderMonitorReportPage;
