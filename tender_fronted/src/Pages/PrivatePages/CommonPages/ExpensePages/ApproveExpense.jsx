import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid2, Stack } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CustomPageTitle from '../../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../../Components/Common/CustomButton';
import { useAuth } from '../../../../Providers/AuthProvider';
import { TENDER_APPROVAL_STATUS, USER_ROLES } from '../../../../Utils/Constants';
import ViewExpense from './ViewExpense';
import ExpenseApproveRejectDialog from './ExpenseApproveRejectDialog';


export default function ApproveExpense() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { expenseId } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleReject = (e) => {
        e.preventDefault();
        setActionType(TENDER_APPROVAL_STATUS.REJECTED.name);
        setIsOpen(true);
    }

    const handleApprove = (e) => {
        e.preventDefault();
        setActionType(TENDER_APPROVAL_STATUS.APPROVED.name);
        setIsOpen(true);
    }

    const handleClose = (e, isRedirect) => {
        e.preventDefault();
        setIsOpen(false);
        setActionType('');
        if (isRedirect === true) {
            navigate('/dashboard');
        }
    }

    const getPreviewButtons = () => {
        if (user.role === USER_ROLES.DIRECTOR.id || user.role === USER_ROLES.TECH_TEAM.id) {
            return (
                <Grid2 paddingTop={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }} >
                    <Stack direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}>
                        <CustomButton onClick={handleReject}
                            variant='contained' color='error'
                            position="end"
                            endIcon={<RemoveDoneIcon small="size" color="white" />}
                        >
                            REJECT
                        </CustomButton>
                        < CustomButton onClick={handleApprove}
                            variant='contained' color='success'
                            position="end"
                            endIcon={<DoneAllIcon small="size" color="white" />}
                        >
                            APPROVE
                        </CustomButton>
                    </Stack>
                </Grid2>)
        }
    }

    return (
        <Box>
            {isOpen && <ExpenseApproveRejectDialog open={isOpen} expenseId={expenseId}
                actionType={actionType} handleClose={handleClose} />}
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Expense Approval' />
                </Grid2>
                <Grid2 sx={{ display: { xs: 'none', md: 'block' } }} size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                    {getPreviewButtons()}
                </Grid2>

                {/* Accordion Content */}
                <ViewExpense expenseId={expenseId} />

                {getPreviewButtons()}

            </Grid2>
        </Box >
    )
}