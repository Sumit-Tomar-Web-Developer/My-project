import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#1976d2', '#43a047', '#e53935'];

const ExpensePieChart = ({
    submitted = 0,
    disbursed = 0,
    rejected = 0,
    title,
}) => {
    const pieChartData = {
        labels: ['Expense Pending Approval', 'Expense Disbursed', 'Expense Rejected'],
        datasets: [
            {
                data: [submitted - disbursed - rejected, disbursed, rejected],
                backgroundColor: COLORS,
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        let value = context.parsed || 0;
                        return `${label}: ₹${value.toLocaleString()}`;
                    }
                }
            }
        }
    };

    return (
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
            <Typography variant="subtitle1" fontWeight="700" color="text.secondary" gutterBottom>
                {title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={pieChartData} options={pieChartOptions} style={{ maxWidth: 260, maxHeight: 220 }} />
            </Box>
        </Paper>
    );
};

export default ExpensePieChart;