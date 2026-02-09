import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    Grid2,
    Alert,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@mui/material";

import CustomPageTitle from "../../../Components/Common/CustomPageTitle";
import { API_STATUS, TENDER_STATUS } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import { getCorrigenDumList } from "../../../AppApis/ApiFunctions";
import { formatDateForTable } from "../../../Utils/UtilityFunctions";
import AddCorrigendumDialog from "./AddCorrigendumDialog";
import CustomTableSearch from "../../../Components/Common/CustomTableSearch";


export default function UpdateTenderCorrigendum() {

    const { toastMessage } = useToast();

    const [isOpen, setIsOpen] = useState(false);

    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [tenderStatus, setTenderStatus] = useState('');

    const [searchKeys, setSearchKeys] = useState({
        departmentId: "",
        location: "",
        tenderId: ""
    })

    const [corrigendumList, setCorrigendumList] = useState(null);

    // Pagination API call
    const getCorrigendumData = (departmentId, location, tenderId) => {
        // Make API call to fetch new data from USER Table
        setIsLoadingTable(true);
        let requestData = {
            id: tenderId
        };
        getCorrigenDumList(requestData).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setSearchKeys({ departmentId: departmentId, location: location, tenderId: tenderId })
                    setTenderStatus(res.data.data.tenderStatus);
                    setCorrigendumList(res.data.data.corrigendumList);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Corrigendum List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Corrigendum List!!");
            }
        }).finally(() => {
            setIsLoadingTable(false);
        });
    }

    const handleSearch = (departmentId, location, tenderId) => {
        if (tenderId === '') {
            toastMessage.error("Please Select the Project ID!!")
            return;
        }
        setCorrigendumList(null);
        getCorrigendumData(departmentId, location, tenderId);
    }

    const handleAddCorrigendum = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const onHandleClose = (e, isReloadNeeded = false) => {
        e.preventDefault();
        setIsOpen(false);
        if (isReloadNeeded === true) {
            getCorrigendumData(searchKeys.departmentId, searchKeys.location, searchKeys.tenderId);
        };
    }

    const tableCellTheme = (theme) => ({
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.44)' : theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: "0.9rem",
        fontWeight: 500,
        borderLeft: `0.01rem solid ${theme.palette.divider}`,
    })

    return (
        <Box>
            {isOpen && <AddCorrigendumDialog open={isOpen} handleClose={onHandleClose} projectId={searchKeys.tenderId} />}
            <CustomPageTitle title="Update Tender Corrigendum" />
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                    <CustomTableSearch filterType={"corrigendum"} handleSearch={handleSearch} />
                </Grid2>
                {
                    corrigendumList === null && (
                        <Grid2 container size={{ xs: 12, sm: 12, md: 12 }} spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Alert severity="info">
                                    No Results to Show!!
                                </Alert>
                            </Grid2>
                        </Grid2>
                    )
                }
                {
                    corrigendumList && (
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>

                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }} marginBottom={2}>
                                <Alert severity="info">
                                    Showing result for Project ID :  <b>{searchKeys.tenderId}</b>
                                </Alert>
                            </Grid2>

                            <Grid2 container size={{ xs: 12, sm: 12, md: 12 }} spacing={2}>
                                {tenderStatus >= TENDER_STATUS.Submitted.id && tenderStatus < TENDER_STATUS.ProjectCompleted.id &&
                                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }} sx={{ display: "flex", justifyContent: 'end' }}>
                                        <Button
                                            id="add_corrigendum_button"
                                            onClick={handleAddCorrigendum}
                                            variant="contained"
                                            sx={{
                                                minWidth: "20%",
                                            }}
                                            startIcon={<AddIcon />}
                                        >
                                            Add Corrigendum
                                        </Button>
                                    </Grid2>
                                }
                                {corrigendumList.length === 0 && (
                                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }} >
                                        <Paper elevation={3} sx={{ padding: "1rem", marginTop: "1rem" }}>
                                            < Grid2 size={{ xs: 12, sm: 12, md: 12 }} sx={{ display: "flex", justifyContent: 'center' }}>
                                                <Alert severity="warning">
                                                    {tenderStatus >= TENDER_STATUS.Submitted.id && tenderStatus < TENDER_STATUS.ProjectCompleted.id ?
                                                        'No Corrigendums added. ' : '  No Corrigendums added. Please click on "Add Corrigendum" to add corrigendum.'}
                                                </Alert>
                                            </Grid2>
                                        </Paper>
                                    </Grid2>
                                )}
                                {corrigendumList.length > 0 && (
                                    <Grid2 size={{ xs: 12 }}>
                                        <TableContainer component={Paper}>
                                            <Table aria-label="corrigendum table">
                                                <TableHead>
                                                    <TableRow >
                                                        <TableCell sx={(theme) => tableCellTheme(theme)}>
                                                            Sr No
                                                        </TableCell>
                                                        <TableCell sx={(theme) => tableCellTheme(theme)} align="center">
                                                            Corrigendum Received Date
                                                        </TableCell>
                                                        <TableCell sx={(theme) => tableCellTheme(theme)} align="center">
                                                            Tender Extend Date
                                                        </TableCell>
                                                        <TableCell sx={(theme) => tableCellTheme(theme)} align="left">
                                                            Changes</TableCell>
                                                        <TableCell sx={(theme) => tableCellTheme(theme)} align="left">
                                                            Created By</TableCell>
                                                        <TableCell sx={(theme) => tableCellTheme(theme)} align="center">
                                                            Created On</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {corrigendumList.map((row, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {formatDateForTable(row.corrigendumReceivedDate)}</TableCell>
                                                            <TableCell align="center">
                                                                {formatDateForTable(row.tenderExtendDate)}</TableCell>
                                                            <TableCell align="left">{row.changes}</TableCell>
                                                            <TableCell align="left">{row.createdBy}</TableCell>
                                                            <TableCell align="center">{formatDateForTable(row.updatedAt)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid2>
                                )}
                            </Grid2>
                        </Grid2>
                    )
                }

            </Grid2 >
        </Box >
    );
};
