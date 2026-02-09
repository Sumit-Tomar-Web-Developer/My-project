import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormControl, Grid2, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import { DEPARTMENTS, USER_ROLES } from "../../Utils/Constants";
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from "../../Providers/AuthProvider";

const ExpenseTableSearch = ({
    fetchReport,
    loading
}) => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const departments = Object.values(DEPARTMENTS);
    const [year, setYear] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    useEffect(() => {
        let departmentId = '';
        if (user.role === USER_ROLES.MD.id) {
            departmentId = searchParams.get('departmentId');
        }
        else {
            departmentId = user.department;
        }
        setDepartmentId(departmentId || '');
        setSearchParams({});
        fetchReport('', departmentId);
    }, []);

    return (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 12, md: 2 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel size="small">Year</InputLabel>
                        <Select
                            size="small"
                            value={year}
                            label="Year"
                            onChange={e => setYear(e.target.value)}
                        >
                            {Array.from({ length: new Date().getFullYear() - 2025 + 1 }, (_, i) => {
                                const y = 2025 + i;
                                return <MenuItem key={y} value={y}>{y}</MenuItem>;
                            }).reverse()}
                        </Select>
                    </FormControl>
                </Grid2>
                {user.role === USER_ROLES.MD.id && (
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel size="small">Department</InputLabel>
                            <Select
                                size="small"
                                value={departmentId}
                                label="Department"
                                onChange={e => setDepartmentId(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {departments.map(dep => (
                                    <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                )}
                <Grid2 size={user.role === USER_ROLES.MD.id ? { xs: 12, md: 6 } : { xs: 12, md: 10 }}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CustomButton
                        id="search_button"
                        onClick={() => fetchReport(year, departmentId)}
                        variant="contained"
                        position="end"
                        endIcon={<SearchIcon small="size" />}
                        loading={loading}
                        color="secondary"
                    >
                        Fetch Report
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Paper>
    )
};

export default ExpenseTableSearch;
