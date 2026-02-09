import { useState } from 'react';
import { Box, Grid2 } from '@mui/material';
import { getTenderAggExpReportApi } from '../../../AppApis/ApiFunctions';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import { useToast } from '../../../Providers/ToastProvider';
import ExpensePieChart from '../../../Components/ReportsHelper/ExpensePieChart';
import ExpenseDetails from '../../../Components/ReportsHelper/ExpenseDetails';
import ExpenseSummary from '../../../Components/ReportsHelper/ExpenseSummary';
import ExpenseTableSearch from '../../../Components/ReportsHelper/ExpenseTableSearch';

const TenderAggExpenseReportPage = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToast();

    const fetchReport = (year, departmentId) => {
        setLoading(true);
        let params = {
            year, departmentId: departmentId || undefined
        }
        getTenderAggExpReportApi(params).then(res => {
            setRows(res.data.data.map((item, idx) => ({
                id: idx + 1,
                tenderId: item.tenderId,
                departmentName: item.departmentName,
                totalExpenseSubmitted: item.totalExpenseSubmitted,
                totalExpenseDisbursed: item.totalExpenseDisbursed,
                totalExpensesRejected: item.totalExpensesRejected,
            })));
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in getting Report!!");
            }
        }).finally(() => setLoading(false));
    };

    // Aggregate totals for summary and pie chart
    const totalSubmitted = rows.reduce((sum, r) => sum + (r.totalExpenseSubmitted || 0), 0);
    const totalDisbursed = rows.reduce((sum, r) => sum + (r.totalExpenseDisbursed || 0), 0);
    const totalRejected = rows.reduce((sum, r) => sum + (r.totalExpensesRejected || 0), 0);

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <CustomPageTitle title="Expense Aggregrated - Tender Report" />
            <ExpenseTableSearch fetchReport={fetchReport} />

            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 12, md: 4 }}>
                    <ExpenseSummary
                        title="Tender Expense Distribution"
                        submitted={totalSubmitted}
                        disbursed={totalDisbursed}
                        rejected={totalRejected}
                    />
                    <ExpensePieChart
                        title="Tender Expense Distribution"
                        submitted={totalSubmitted}
                        disbursed={totalDisbursed}
                        rejected={totalRejected}
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 12, md: 8 }}>
                    <ExpenseDetails
                        isTender={true}
                        rows={rows}
                        loading={loading}
                    />
                </Grid2>
            </Grid2>
        </Box >
    );
};

export default TenderAggExpenseReportPage;