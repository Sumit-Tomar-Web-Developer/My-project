import { useState, Fragment, useEffect } from 'react';
import { Divider, Grid, Grid2, MenuItem, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useToast } from '../../../../Providers/ToastProvider';
import { API_STATUS, EXPENSE_STATUS } from "../../../../Utils/Constants";
import { getExpenseTypeList } from '../../../../AppApis/ApiFunctions';
import CustomTextField from '../../../../Components/Common/CustomTextField';
import CustomFileDownload from '../../../../Components/Common/CustomFileDownload';
import { getRequest } from '../../../../AppApis/ApiFunctions';
import { API_URLS } from '../../../../AppApis/APIUrls';
import { formatDateForInput } from '../../../../Utils/UtilityFunctions';



export default function ViewExpense(props) {
    const { toastMessage } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [expenseData, setExpenseData] = useState({
        id: '',
        tenderId: '',
        expenseamount: '',
        expenseTypeId: '',
        expenseSubTypeId: '',
        expenseDetails: '',
        justification: '',
        userId: '',
        invoicenumber: '',
        receiptGuid: '',
        receiptFileName: '',
        createdBy: '',
        updatedBy: '',
        TechLeadApproval: '',
        TechLeadComments: '',
        TechLeadApprover: '',
        TechLeadApprovedAt: '',
        DirectorApproval: '',
        DirectorComments: '',
        DirectorApprover: '',
        DirectorApprovedAt: '',
        FinanceApproval: '',
        FinanceComments: '',
        FinanceApprover: '',
        FinanceApprovedAt: '',
        FinancePaidAmount: '',
        FinanceTDSAmount: '',
        paymentProofFileGuid: '',
        paymentProofFileName: '',
        paymentDate: '',
        currentStatus: ''
    })

    useEffect(() => {
        getExpenseTypeData();
        getExpenseDetails();
    }, [])

    const getExpenseTypeData = () => {
        getExpenseTypeList({}).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setExpenseTypes(res.data.data.expenseTypeList);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Expense List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Expense List!!");
            }
        })
    }

    const getExpenseDetails = () => {
        let baseTenderUrl = `/tenders/${props.expenseId}/${API_URLS.GET.GET_EXPENSE_DATA}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setExpenseData(res.data.data);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Expense List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Expense List!!");
            }
        })
    }

    return (
        <Fragment>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Grid2 container spacing={2} margin={2}>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            id="id"
                            label="Expense ID"
                            name="id"
                            value={expenseData.id}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            id="tenderId"
                            label="Project ID"
                            name="tenderId"
                            value={expenseData.tenderId}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            id="userId"
                            label="Employee ID"
                            name="userId"
                            value={expenseData.userId}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            id="invoicenumber"
                            label="Invoive No."
                            name="invoicenumber"
                            value={expenseData.invoicenumber}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            fullWidth
                            id="expenseTypeId"
                            label="Expense Category"
                            name="expenseTypeId"
                            select
                            value={expenseData.expenseTypeId}
                        >
                            {expenseTypes.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.expenseType}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            fullWidth
                            id="expenseSubTypeId"
                            label="Expense Sub Category"
                            name="expenseSubTypeId"
                            select
                            value={expenseData.expenseSubTypeId}
                        >
                            {expenseTypes.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.expenseType}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            type="number"
                            id="expenseamount"
                            label="Expense Amount"
                            name="expenseamount"
                            value={expenseData.expenseamount}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            multiline
                            rows={3}
                            id="expenseDetails"
                            label="Expense Details"
                            name="expenseDetails"
                            value={expenseData.expenseDetails}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <Stack direction="row" spacing={1} alignItems={"center"}>
                            <Typography variant="subtitle2" gutterBottom>Invoice Reciept :</Typography>
                            {expenseData.receiptFileName === '' ? 'NO FILES UPLOADED' : (
                                <CustomFileDownload
                                    guid={expenseData.receiptGuid}
                                    isedit={false}
                                    fileName={expenseData.receiptFileName}
                                    projectID={expenseData.tenderId}
                                />
                            )}
                        </Stack>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            id="createdBy"
                            label="Submitted By"
                            name="createdBy"
                            value={expenseData.updatedBy}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomTextField
                            isedit={false}
                            size="small"
                            required
                            fullWidth
                            id="createdAt"
                            label="Submitted On"
                            name="createdAt"
                            value={expenseData.updatedAt}
                        />
                    </Grid2>
                    {expenseData.currentStatus >= EXPENSE_STATUS.TechnicalApprovalDone.id && (
                        <Fragment>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }} mt={2}>
                                <Divider>Tech Team {expenseData.TechLeadApproval} Details </Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="TechLeadComments"
                                    label={"Tech Lead " + expenseData.TechLeadApproval + " Comment"}
                                    name="TechLeadComments"
                                    value={expenseData.TechLeadComments}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    id="TechLeadApprover"
                                    label={"Tech Lead " + expenseData.TechLeadApproval + " By"}
                                    name="TechLeadApprover"
                                    value={expenseData.TechLeadApprover}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    id="TechLeadApprovedAt"
                                    label={"Tech Lead " + expenseData.TechLeadApproval + " On"}
                                    name="TechLeadApprovedAt"
                                    value={expenseData.TechLeadApprovedAt}
                                />
                            </Grid2>
                        </Fragment>
                    )}
                    {expenseData.currentStatus >= EXPENSE_STATUS.DirectorApprovalDone.id &&
                        expenseData.currentStatus != EXPENSE_STATUS.TechnicalRejectDone.id && (
                            <Fragment>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12 }} mt={2}>
                                    <Divider>Director {expenseData.TechLeadApproval} Details </Divider>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        multiline
                                        rows={3}
                                        id="DirectorComments"
                                        label={"Director " + expenseData.DirectorApproval + " Comment"}
                                        name="DirectorComments"
                                        value={expenseData.DirectorComments}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        id="DirectorApprover"
                                        label={"Director " + expenseData.DirectorApproval + " By"}
                                        name="DirectorApprover"
                                        value={expenseData.DirectorApprover}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        id="DirectorApprovedAt"
                                        label={"Director " + expenseData.DirectorApproval + " On"}
                                        name="DirectorApprovedAt"
                                        value={expenseData.DirectorApprovedAt}
                                    />
                                </Grid2>
                            </Fragment>
                        )}

                    {(expenseData.currentStatus === EXPENSE_STATUS.Completed.id ||
                        expenseData.currentStatus === EXPENSE_STATUS.FinanceRejectDone.id) &&
                        (
                            <Fragment>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12 }} mt={2}>
                                    <Divider>Finance Team {expenseData.FinanceApproval} Details </Divider>
                                </Grid2>
                                {expenseData.currentStatus === EXPENSE_STATUS.Completed.id && (
                                    <Fragment>
                                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                            <CustomTextField
                                                isedit={false}
                                                size="small"
                                                required
                                                fullWidth
                                                id="FinancePaidAmount"
                                                label="Paid Amount"
                                                name="FinancePaidAmount"
                                                value={expenseData.FinancePaidAmount}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                            <CustomTextField
                                                isedit={false}
                                                size="small"
                                                required
                                                fullWidth
                                                id="FinanceTDSAmount"
                                                label="TDS Amount"
                                                name="FinanceTDSAmount"
                                                value={expenseData.FinanceTDSAmount}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                            <CustomTextField
                                                isedit={false}
                                                size="small"
                                                required
                                                fullWidth
                                                id="paymentDate"
                                                label="Payment Date"
                                                name="paymentDate"
                                                value={formatDateForInput(expenseData.paymentDate)}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                                <Typography variant="subtitle2" gutterBottom>Payment Proof Reciept :</Typography>
                                                {expenseData.paymentProofFileName === '' ? 'NO FILES UPLOADED' : (
                                                    <CustomFileDownload
                                                        guid={expenseData.paymentProofFileGuid}
                                                        isedit={false}
                                                        fileName={expenseData.paymentProofFileName}
                                                        projectID={expenseData.tenderId}
                                                    />
                                                )}
                                            </Stack>
                                        </Grid2>
                                    </Fragment>
                                )}
                                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        multiline
                                        rows={3}
                                        id="FinanceComments"
                                        label={"Finance " + expenseData.FinanceApproval + " Remarks"}
                                        name="FinanceComments"
                                        value={expenseData.FinanceComments}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        id="FinanceApprover"
                                        label={"Finance " + expenseData.FinanceApproval + " By"}
                                        name="FinanceApprover"
                                        value={expenseData.FinanceApprover}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        id="FinanceApprovedAt"
                                        label={"Finance " + expenseData.FinanceApproval + " On"}
                                        name="FinanceApprovedAt"
                                        value={expenseData.FinanceApprovedAt}
                                    />
                                </Grid2>
                            </Fragment>
                        )}
                </Grid2>
            </Paper>
        </Fragment>
    );
}

ViewExpense.prototype = {
    expenseId: PropTypes.number.isRequired,
}