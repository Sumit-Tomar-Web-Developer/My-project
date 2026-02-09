import { Card, CardContent, Divider, Typography } from "@mui/material";

const COLORS = ['#1976d2', '#43a047', '#e53935'];

const ExpenseSummary = ({
    title,
    submitted,
    disbursed,
    rejected,
}) => {
    return (
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="700" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, }}>
                    <strong>Expense Submitted:</strong> ₹{submitted.toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS[1] }}>
                    <strong>Expense Disbursed:</strong> ₹{disbursed.toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS[2] }}>
                    <strong>Expense Rejected:</strong> ₹{rejected.toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: COLORS[0] }}>
                    <strong>Expense Pending Approval:</strong> ₹{(submitted - disbursed - rejected).toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    )
};

export default ExpenseSummary;