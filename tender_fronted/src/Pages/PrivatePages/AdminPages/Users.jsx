import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useToast } from '../../../Providers/ToastProvider';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CustomButton from "../../../Components/Common/CustomButton";
import CustomTable from "../../../Components/Common/CustomTable";
import AddEditUserDialog from "./AddEditUserDialog";
import { getDepartmentListApi, getUserListApi } from "../../../AppApis/ApiFunctions";
import { API_STATUS, TABLE_CELL_TYPES } from "../../../Utils/Constants";
import DeleteUserDialog from "./DeleteUserDialog";
import { getDepartmentName, getUserRoleName } from "../../../Utils/UtilityFunctions";
import CustomPageTitle from "../../../Components/Common/CustomPageTitle";


export default function Users() {
    const { toastMessage } = useToast();

    const [isEditAddOpen, setIsEditAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEdit, setIsEdit] = useState(false);


    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [userID, setUserID] = useState("");
    const [pageNum, setPageNum] = useState(0);
    const [userList, setUserList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
        getDepartmentListData();
        getPaginationData(0, 5);
    }, []);

    const onEditClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < userList.length) {
            setSelectedUser(userList[rowIndex]);
            setIsEdit(true);
            setIsEditAddOpen(true);
        }
    }

    const onHandleEditAddClose = (e, isReloadNeeded = false) => {
        e.preventDefault();
        setSelectedUser({});
        setIsEditAddOpen(false);
        if (isReloadNeeded === true) {
            getPaginationData(pageNum, rowsPerPage);
        };
    }

    const handleCreateNewUser = (e) => {
        e.preventDefault();
        setSelectedUser({});
        setIsEdit(false);
        setIsEditAddOpen(true);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        getPaginationData(0, rowsPerPage);
    }

    const onDeleteClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < userList.length) {
            setSelectedUser(userList[rowIndex]);
            setIsDeleteOpen(true);
        }
    }

    const onHandleDeleteClose = (e, isReloadNeeded = false) => {
        e.preventDefault();
        setSelectedUser({});
        setIsDeleteOpen(false);
        if (isReloadNeeded === true) {
            if ((pageNum + 1) * rowsPerPage < totalCount - 1) {
                getPaginationData(pageNum, rowsPerPage);
            }
            else {
                setPageNum(pageNum - 1);
                getPaginationData(pageNum - 1, rowsPerPage);
            }

        }
    }

    const onHandleChange = (e) => {
        switch (e.target.name) {
            case "userID":
                setUserID(e.target.value);
                break;
            default:
                console.log("Invalid name in onHandleChange: " + e.target.name);
                break;
        };
    }

    const getEditButtonConfig = (row) => {
        return {
            value: 'Edit',
            color: "success",
            icon: "EditIcon",
        };
    }

    const getDeleteButtonConfig = (row) => {
        return {
            value: 'Delete',
            color: "error",
            icon: "DeleteIcon",
        };
    }

    const getDepartmentNameFromList = (department) => {
        return getDepartmentName(department, departmentList)
    }

    const tableConfig = [
        {
            heading: "Emp ID",
            key: "userId",
            type: TABLE_CELL_TYPES.TEXT,
            style: {},
            align: "left"
        },
        {
            heading: "Emp Name",
            key: "name",
            type: TABLE_CELL_TYPES.TEXT,
            style: {},
            align: "left"
        },
        {
            heading: "Emp Contact",
            key: "contactInfo",
            type: TABLE_CELL_TYPES.TEXT,
            style: {},
            align: "left"
        },
        {
            heading: "Department",
            key: "department",
            type: TABLE_CELL_TYPES.TEXT,
            valueFunc: getDepartmentNameFromList,
            style: {},
            align: "left"
        },
        {
            heading: "User Role",
            key: "userRoleId",
            type: TABLE_CELL_TYPES.TEXT,
            valueFunc: getUserRoleName,
            style: {},
            align: "left"
        },
        {
            heading: "Edit",
            key: "edit",
            type: TABLE_CELL_TYPES.BUTTON,
            style: {},
            align: "center",
            getButtonConfig: getEditButtonConfig,
            onHandleClick: onEditClick
        },
        {
            heading: "Delete",
            key: "delete",
            type: TABLE_CELL_TYPES.BUTTON,
            style: {},
            align: "center",
            getButtonConfig: getDeleteButtonConfig,
            onHandleClick: onDeleteClick
        }
    ]

    // Pagination API call
    const getPaginationData = (newPageNum, newrowsPerPage) => {
        // Make API call to fetch new data from USER Table
        setIsLoadingTable(true);
        setRowsPerPage(newrowsPerPage);

        let requestData = {
            userId: userID,
            page: newPageNum,
            rowsPerPage: newrowsPerPage
        };
        getUserListApi(requestData).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    let tempUserList = res.data.data.userList ? res.data.data.userList : [];
                    setUserList(tempUserList);
                    setPageNum(res.data.data.currentPage);
                    setTotalCount(res.data.data.totalUsers);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Users List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Users List!!");
            }
        }).finally(() => {
            setIsLoadingTable(false);
        });
    }

    // Pagination API call
    const getDepartmentListData = () => {
        getDepartmentListApi({}).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    let depList = res.data.data ? res.data.data : [];
                    setDepartmentList(depList)
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Users List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Users List!!");
            }
        }).finally(() => {
            setIsLoadingTable(false);
        });
    }

    return (
        <Box>
            <CustomPageTitle title="User Management" />
            {isEditAddOpen && (
                <AddEditUserDialog open={isEditAddOpen}
                    departmentList={departmentList}
                    isEdit={isEdit}
                    handleClose={onHandleEditAddClose}
                    data={selectedUser} />)}
            {isDeleteOpen && (
                <DeleteUserDialog open={isDeleteOpen}
                    departmentList={departmentList}
                    handleClose={onHandleDeleteClose}
                    data={selectedUser} />)}
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        id="create_new_user"
                        sx={{ display: "flex", justifyContent: "left" }}
                    >
                        <Button
                            id="create_new_user_button"
                            onClick={handleCreateNewUser}
                            variant="contained"
                            sx={{
                                minWidth: "20%",
                            }}
                            startIcon={<AddIcon />}
                              color="secondary"
                        >
                            Add User
                        </Button>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        id="search_user"
                        sx={{ display: "flex", justifyContent: "right", spacing: "1rem" }}
                    >
                        <TextField
                            sx={{
                                minWidth: "20%",
                            }}
                            size="small"
                            type="text"
                            label="User ID"
                            name="userID"
                            id="userID"
                            required
                            value={userID}
                            onChange={onHandleChange}
                        />
                        <CustomButton
                            id="search_user_button"
                            onClick={handleSearch}
                            variant="contained"
                            sx={{
                                minWidth: "20%",
                                marginLeft: "1rem"
                            }}
                            position="end"
                            endIcon={<SearchIcon small="size" />}
                            loading={isLoadingTable}
                            color="secondary"
                        >
                            Search
                        </CustomButton>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <CustomTable isLoading={isLoadingTable} totalCount={totalCount} pageNum={pageNum}
                        tableConfig={tableConfig} rowList={userList} rowsPerPage={rowsPerPage}
                        getPaginationData={getPaginationData} />
                </Grid>
            </Grid>
        </Box>
    );
}
