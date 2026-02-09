import {
    Divider, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const COLORS = ['#1976d2', '#43a047', '#e53935'];

const ExpenseDetails = ({
    isTender,
    loading,
    rows
}) => {
    const navigate = useNavigate();

    return (
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle1" fontWeight="700" color="text.secondary" gutterBottom>
                Detailed Report
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {isTender && (<TableCell><strong>Project ID</strong></TableCell>)}
                            <TableCell ><strong>Department</strong></TableCell>
                            <TableCell align="right"><strong>Submitted</strong></TableCell>
                            <TableCell align="right" sx={{ color: COLORS[1] }}><strong>Disbursed</strong></TableCell>
                            <TableCell align="right" sx={{ color: COLORS[2] }}><strong>Rejected</strong></TableCell>
                            <TableCell align="right" sx={{ color: COLORS[0] }}><strong>Pending Approval</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map(row => (
                                <TableRow key={row.id}>
                                    {isTender ? (
                                        <>
                                            <TableCell>
                                                <Link
                                                    component="button"
                                                    variant="body2"
                                                    sx={{ textDecoration: "none", color: "secondary.main", fontWeight: "bold" }}
                                                    onClick={() => {
                                                        navigate(`/report/tenderExpenseReport?tenderId=${row.tenderId}`);
                                                    }}
                                                >
                                                    Project_{row.tenderId}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{row.departmentName}</TableCell>
                                        </>) : (
                                        <TableCell>
                                            <Link
                                                component="button"
                                                variant="body2"
                                                sx={{ textDecoration: "none", color: "secondary.main", fontWeight: "bold" }}
                                                onClick={() => {
                                                    navigate(`/report/tenderAggExpenseReport?departmentId=${row.departmentId}`);
                                                }}
                                            >
                                                {row.departmentName}
                                            </Link>
                                        </TableCell>
                                    )}
                                    <TableCell align="right">
                                        ₹{row.totalExpenseSubmitted?.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: COLORS[1] }}>
                                        ₹{row.totalExpenseDisbursed?.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: COLORS[2] }}>
                                        ₹{row.totalExpensesRejected?.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: COLORS[0] }}>
                                        ₹{(row.totalExpenseSubmitted - row.totalExpenseDisbursed - row.totalExpensesRejected).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
};

export default ExpenseDetails;