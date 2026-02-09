import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid2,
    Alert,
} from "@mui/material";
import { API_STATUS, EXPENSE_STATUS, TABLE_CELL_TYPES, USER_ROLES } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import CustomTable from "../../../Components/Common/CustomTable";
import { getExpenseListApi } from "../../../AppApis/ApiFunctions";
import { formatDateForTable, getExpenseStatusName } from "../../../Utils/UtilityFunctions";
import { useAuth } from "../../../Providers/AuthProvider";
import CustomTableSearch from "../../../Components/Common/CustomTableSearch";


export default function ExpenseSearch(props) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toastMessage } = useToast();

    const [searchKeys, setSearchKeys] = useState({
        departmentId: "",
        location: "",
        tenderId: ""
    })

    const [isLoadingTable, setIsLoadingTable] = useState(false);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageNum, setPageNum] = useState(0);
    const [expenseList, setExpenseList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        setExpenseList([]);
        setRowsPerPage(5);
        setPageNum(0);
        setTotalCount(0);
        if (user.role === USER_ROLES.MD.id) {
            setSearchKeys({
                departmentId: "",
                location: "",
                tenderId: ""
            });
        }
        else {
            setSearchKeys({
                departmentId: user.department,
                location: "",
                tenderId: ""
            });
        }
        getPaginationData(0, rowsPerPage, "", "", "");

    }, [props.isVeiwAll]);

    const onExpenseClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < expenseList.length) {
            navigate(`/view_expense_details/${expenseList[rowIndex].id}`);
        };
    }

    const getActionButtonConfig = (row) => {
        let buttonConfig = null;
        Object.values(EXPENSE_STATUS).forEach((ts) => {
            if (ts.id === row.currentStatus && ts.access[user.role]) {
                buttonConfig = ts.access[user.role]?.config;
            }
        })
        return buttonConfig;
    }

    const onActionClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < expenseList.length) {
            Object.values(EXPENSE_STATUS).forEach((ts) => {
                if (ts.id === expenseList[rowIndex].currentStatus && ts.access[user.role]) {
                    navigate(`/${ts.access[user.role]?.path}/${expenseList[rowIndex].id}`);
                }
            })
        }
    }

    const getTableConfig = () => {
        let tConfig = [
            {
                heading: "Expense ID",
                key: "id",
                preText: "Expense_",
                type: TABLE_CELL_TYPES.LINK,
                style: {},
                align: "center",
                onHandleClick: onExpenseClick,
            },
            {
                heading: "Project ID",
                key: "TenderBasicDetail.tenderId",
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "left"
            },
            {
                heading: "Tender ID",
                key: "TenderBasicDetail.tenderIdText",
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "left"
            },
            {
                heading: "Department",
                key: "TenderBasicDetail.dep.departmentname",
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "center"
            },
            {
                heading: "Expense Type",
                key: "ExpenseType.expenseType",
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "center"
            },
            {
                heading: "Expense Sub Type",
                key: "expenseSubTypeId",
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "center"
            },
            {
                heading: "Date",
                key: "createdAt",
                valueFunc: formatDateForTable,
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "center"
            },
            {
                heading: "Status",
                key: "currentStatus",
                valueFunc: getExpenseStatusName,
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "center"
            }
        ]
        if (props.isVeiwAll === false) {
            switch (user.role) {
                // case USER_ROLES.DATA_APPLICANT.id:
                //     tConfig.push({
                //         heading: "Action",
                //         key: "action",
                //         type: TABLE_CELL_TYPES.BUTTON,
                //         style: {},
                //         align: "center",
                //         getButtonConfig: getActionButtonConfig,
                //         onHandleClick: onActionClick
                //     })
                //     break;
                case USER_ROLES.TECH_TEAM.id:
                    tConfig.push({
                        heading: "Action",
                        key: "approve",
                        type: TABLE_CELL_TYPES.BUTTON,
                        style: {},
                        align: "center",
                        getButtonConfig: getActionButtonConfig,
                        onHandleClick: onActionClick
                    })
                    break;
                case USER_ROLES.DIRECTOR.id:
                    tConfig.push({
                        heading: "Action",
                        key: "approve",
                        type: TABLE_CELL_TYPES.BUTTON,
                        style: {},
                        align: "center",
                        getButtonConfig: getActionButtonConfig,
                        onHandleClick: onActionClick
                    })
                    break;
                case USER_ROLES.FINANCE.id:
                    tConfig.push({
                        heading: "Action",
                        key: "view",
                        type: TABLE_CELL_TYPES.BUTTON,
                        style: {},
                        align: "center",
                        getButtonConfig: getActionButtonConfig,
                        onHandleClick: onActionClick
                    })
                    break;
                default:
                    break;
            }
        }
        return tConfig;
    }

    const tableConfig = getTableConfig();

    // Pagination API call
    const getPaginationData = (newPageNum, newrowsPerPage, departmentId, location, tenderId) => {

        if (user.role !== USER_ROLES.MD.id) {
            departmentId = user.department;
        }

        // Make API call to fetch new data from USER Table
        setIsLoadingTable(true);
        setRowsPerPage(newrowsPerPage);

        let requestData = {
            location: location,
            id: tenderId,
            department: departmentId,
            page: newPageNum,
            size: newrowsPerPage,
            getAll: props.isVeiwAll
        };
        getExpenseListApi(requestData).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setSearchKeys({ departmentId: departmentId, location: location, tenderId: tenderId })
                    setExpenseList(res.data.data.expenseList);
                    setPageNum(res.data.data.currentPage);
                    setTotalCount(res.data.data.totalExpenses);
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
        }).finally(() => {
            setIsLoadingTable(false);
        });
    }

    const handleSearch = (departmentId, location, tenderId) => {
        getPaginationData(0, rowsPerPage, departmentId, location, tenderId);
    }

    return (
        <Box>
            {/* <CustomPageTitle title={props.isVeiwAll ? "All Projects" : "My WorkList"} /> */}
            {!isLoadingTable && expenseList.length === 0 ? (
                <Grid2 container size={{ xs: 12 }} spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <Alert severity="info">
                            {props.isVeiwAll ? 'No Expense Submitted!!' : 'No Expense work list pending on you!!'}
                        </Alert>
                    </Grid2>
                </Grid2>
            ) : (
                <Grid2 container spacing={2}>
                    {!isLoadingTable && <Grid2 size={{ xs: 12 }}>
                        <CustomTableSearch filterType={props.isVeiwAll ? "expenseAll" : "expenseWorklist"}
                            handleSearch={handleSearch} />
                    </Grid2>}
                    <Grid2 size={{ xs: 12 }}>
                        <CustomTable isLoading={isLoadingTable} totalCount={totalCount} pageNum={pageNum}
                            tableConfig={tableConfig} rowList={expenseList} rowsPerPage={rowsPerPage}
                            getPaginationData={getPaginationData} />
                    </Grid2>
                </Grid2>
            )
            }
        </Box >
    );
};
