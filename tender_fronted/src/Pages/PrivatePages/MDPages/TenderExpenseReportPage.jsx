import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box, Paper, Grid2, TextField, FormControl, InputLabel, Select, MenuItem, Link,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import CustomButton from "../../../Components/Common/CustomButton";
import { API_STATUS, EXPENSE_STATUS, USER_ROLES } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import { useAuth } from "../../../Providers/AuthProvider";
import { getTenderExpReportApi, getExpenseSearchFiltersApi, getAllUserListApi } from '../../../AppApis/ApiFunctions';
import { formatDateForTable } from '../../../Utils/UtilityFunctions';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';

const TenderExpenseReportPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const { toastMessage } = useToast();

    // Filter state
    const [filters, setFilters] = useState({
        tenderId: '',
        location: '',
        departmentId: '',
        expenseStatusId: '',
        userId: '',
        expenseAmountStart: '',
        expenseAmountEnd: '',
        expenseSubmittedDateStart: '',
        expenseSubmittedDateEnd: '',
        page: 0,
        size: 10,
    });

    // Autocomplete input states
    const [inputDepartmentId, setInputDepartmentId] = useState("");
    const [inputLoc, setInputLoc] = useState("");
    const [inputTenderId, setInputTenderId] = useState("");
    const [inputUserId, setInputUserId] = useState("");

    // Data lists
    const [locTenderMap, setLocTenderMap] = useState({});
    const [locationList, setLocationList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [tenderIdList, setTenderIdList] = useState([]);
    const [filUserList, setFilUserList] = useState([]);
    const [allUserList, setAllUserList] = useState([]);

    // Table data
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch filters and users on mount
    useEffect(() => {
        fetchFilters();
        getUserList();
    }, []);

    // Fetch report on mount and when filters.page/filters.size changes
    useEffect(() => {
        let tenderId = searchParams.get('tenderId');
        setSearchParams({});
        let newFilters = { ...filters, page: filters.page, size: filters.size };
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
    }, [filters.page, filters.size]);

    // Fetch filter options
    const fetchFilters = () => {
        setLoading(true);
        getExpenseSearchFiltersApi({}).then((res) => {
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

    // Fetch user list
    const getUserList = () => {
        getAllUserListApi({}).then((res) => {
            if (res.data && res.data.type === API_STATUS.SUCCESS) {
                let tempUserList = res.data.data.userList.map((user) => ({
                    name: user.userId,
                    value: user.userId,
                    departmentId: user.department
                }));
                setAllUserList(tempUserList);
                setFilUserList(tempUserList);
            } else {
                toastMessage.error(res.data?.message || "Error in Fetching User List!!");
            }
        }).catch((error) => {
            toastMessage.error(error.data?.message || "Error in Fetching User List!!");
        });
    };

    // Filter user list by department
    const getFilterUserList = (departmentId) => {
        if (!departmentId) setFilUserList(allUserList);
        else setFilUserList(allUserList.filter((usr) => usr.departmentId === departmentId));
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
                    getFilterUserList('');
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
                            getFilterUserList(dep);
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
            case "userId":
                setFilters((prev) => ({ ...prev, userId: newValue ? newValue.value : '' }));
                break;
            default:
                break;
        }
    };

    // Handle filter changes for TextField/Select
    const handleFilterChange = (e) => {
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Fetch report data
    const fetchReport = (params) => {
        setLoading(true);
        getTenderExpReportApi({ ...params })
            .then(res => {
                setRows(res.data.data.records.map((item, idx) => ({
                    id: item.id,
                    tenderId: item.tenderId,
                    expenseamount: item.expenseamount,
                    status: item.status,
                    expenseType: item.expenseType,
                    userId: item.userId,
                    departmentName: item.departmentName,
                    submittedDate: item.submittedDate,
                    TechLeadApproval: item.TechLeadApproval,
                    DirectorApproval: item.DirectorApproval,
                    FinanceApproval: item.FinanceApproval,
                    FinancePaidAmount: item.FinancePaidAmount,
                    FinanceTDSAmount: item.FinanceTDSAmount,
                })));
                setTotal(res.data.data.total);
            }).catch((error) => {
                toastMessage.error(error.data?.message || "Error in getting Report!!");
            }).finally(() => setLoading(false));
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };
    const handleChangeRowsPerPage = (event) => {
        setFilters((prev) => ({ ...prev, size: parseInt(event.target.value, 10), page: 0 }));
    };

    return (
        <Box>
            <CustomPageTitle title="Expense Detailed - Tender Report" />
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <Grid2 container spacing={2} alignItems="center">
                    {user.role === USER_ROLES.MD.id && (
                        <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
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
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
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
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
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
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <Autocomplete
                            disablePortal
                            value={filUserList.find(u => u.value === filters.userId) || null}
                            inputValue={inputUserId}
                            onChange={(e, newVal) => onHandleChange('userId', newVal)}
                            onInputChange={(event, newInputValue) => setInputUserId(newInputValue)}
                            size="small"
                            id="userId"
                            options={filUserList}
                            getOptionLabel={(option) => option?.name || ""}
                            renderInput={(params) =>
                                <TextField {...params} size="small" label="User ID" />
                            }
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="expense-status-label">Expense Status</InputLabel>
                            <Select
                                labelId="expense-status-label"
                                label="Expense Status"
                                name="expenseStatusId"
                                value={filters.expenseStatusId}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All</MenuItem>
                                {Object.values(EXPENSE_STATUS).map((status) => (
                                    <MenuItem key={status.id} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    {user.role !== USER_ROLES.MD.id && (
                        <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }} />
                    )}
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <TextField
                            label="Amount Min"
                            name="expenseAmountStart"
                            value={filters.expenseAmountStart}
                            onChange={handleFilterChange}
                            type="number"
                            size="small"
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <TextField
                            label="Amount Max"
                            name="expenseAmountEnd"
                            value={filters.expenseAmountEnd}
                            onChange={handleFilterChange}
                            type="number"
                            size="small"
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <TextField
                            label="Submitted Start"
                            name="expenseSubmittedDateStart"
                            type="date"
                            value={filters.expenseSubmittedDateStart}
                            onChange={handleFilterChange}
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <TextField
                            label="Submitted End"
                            name="expenseSubmittedDateEnd"
                            type="date"
                            value={filters.expenseSubmittedDateEnd}
                            onChange={handleFilterChange}
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            fullWidth
                        />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, sm: 3, md: 2.4 }}>
                        <CustomButton
                            id="fetch_report_button"
                            onClick={() => fetchReport({ ...filters, page: 0 })}
                            variant="contained"
                            endIcon={<SearchIcon />}
                            loading={loading}
                            color="secondary"
                            fullWidth
                        >
                            Fetch Report
                        </CustomButton>
                    </Grid2>
                </Grid2>
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Project ID</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Expense Type</strong></TableCell>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Submitted Date</strong></TableCell>
                                <TableCell align="right"><strong>Submitted Amount</strong></TableCell>
                                <TableCell align="right"><strong>Paid Amount</strong></TableCell>
                                <TableCell align="right"><strong>TDS Amount</strong></TableCell>
                                <TableCell align="center"><strong>Expense Status</strong></TableCell >
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={12} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={12} align="center">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <Link
                                                component="button"
                                                variant="body2"
                                                sx={{ textDecoration: "none", color: "secondary.main", fontWeight: "bold" }}
                                                onClick={() => {
                                                    navigate(`/report/tenderMonitorReport?tenderId=${row.tenderId}`);
                                                }}
                                            >
                                                Project_{row.tenderId}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{row.departmentName}</TableCell>
                                        <TableCell>{row.expenseType}</TableCell>
                                        <TableCell>{row.userId}</TableCell>
                                        <TableCell>{formatDateForTable(row.submittedDate)}</TableCell>
                                        <TableCell align="right">₹{row.expenseamount ? row.expenseamount : 0}</TableCell>
                                        <TableCell align="right">₹{row.FinancePaidAmount ? row.FinancePaidAmount : 0}</TableCell>
                                        <TableCell align="right">₹{row.FinanceTDSAmount ? row.FinanceTDSAmount : 0}</TableCell>
                                        <TableCell align="center">{row.status}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={total}
                    page={filters.page}
                    onPageChange={handleChangePage}
                    rowsPerPage={filters.size}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 50]}
                />
            </Paper>
        </Box >
    );
};

export default TenderExpenseReportPage;