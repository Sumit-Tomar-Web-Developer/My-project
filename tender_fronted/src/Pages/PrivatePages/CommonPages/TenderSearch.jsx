import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid2,
    Alert,
} from "@mui/material";
import { API_STATUS, TABLE_CELL_TYPES, TENDER_STATUS, USER_ROLES } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import CustomTable from "../../../Components/Common/CustomTable";
import { getTenderListApi } from "../../../AppApis/ApiFunctions";
import { formatDateForTable, getTenderStatusName } from "../../../Utils/UtilityFunctions";
import { useAuth } from "../../../Providers/AuthProvider";
import CustomTableSearch from "../../../Components/Common/CustomTableSearch";


export default function TenderSearch(props) {
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
    const [tenderList, setTenderList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {

        setTenderList([]);
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

    const onProjectClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < tenderList.length) {
            if (tenderList[rowIndex].currentStatus !== TENDER_STATUS.Draft.id) {
                navigate(`/view_tender_details/${tenderList[rowIndex].id}`);
            }
            else {
                toastMessage.warning("Project is in Draft!!");
            }
        };
    }

    const getEditButtonConfig = (row) => {
        let buttonConfig = null;

        if (user.role === USER_ROLES.TECH_TEAM.id && row.currentStatus === TENDER_STATUS.Submitted.id) {
            buttonConfig = {
                value: "Edit Project",
                color: "secondary",
                icon: "EditIcon",
            };
        }
        else if (user.role === USER_ROLES.DIRECTOR.id && row.currentStatus === TENDER_STATUS.TechnicalApprovalDone.id) {
            buttonConfig = {
                value: "Edit Project",
                color: "secondary",
                icon: "EditIcon",
            };
        }
        return buttonConfig;
    }

    const onEditClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < tenderList.length) {
            switch (user.role) {
                case USER_ROLES.DATA_APPLICANT.id:
                case USER_ROLES.TECH_TEAM.id:
                case USER_ROLES.DIRECTOR.id:
                    navigate(`/edit_tender_details/${tenderList[rowIndex].id}`);
                    break;
                default:
                    console.log("Invalid Role:" + user.role)
                    break;
            };
        }
    }

    const getActionButtonConfig = (row) => {
        let buttonConfig = null;
        Object.values(TENDER_STATUS).forEach((ts) => {
            if (ts.id === row.currentStatus && ts.access[user.role]) {
                buttonConfig = ts.access[user.role]?.config;
            }
        })
        return buttonConfig;
    }

    const onActionClick = (e, rowIndex) => {
        e.preventDefault();
        if (rowIndex < tenderList.length) {
            Object.values(TENDER_STATUS).forEach((ts) => {
                if (ts.id === tenderList[rowIndex].currentStatus && ts.access[user.role]) {
                    navigate(`/${ts.access[user.role]?.path}/${tenderList[rowIndex].id}`);
                }
            })
        }
    }

    const getTableConfig = () => {
        let tConfig = [
            {
                heading: "Project ID",
                key: "id",
                preText: "Project_",
                type: TABLE_CELL_TYPES.LINK,
                style: {},
                align: "center",
                onHandleClick: onProjectClick,
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
                heading: "Type",
                key: "TenderBasicDetail.departmentType",
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
                valueFunc: getTenderStatusName,
                type: TABLE_CELL_TYPES.TEXT,
                style: {},
                align: "center"
            }
        ]
        if (props.isVeiwAll === false) {
            switch (user.role) {
                case USER_ROLES.DATA_APPLICANT.id:
                    tConfig.push({
                        heading: "Action",
                        key: "action",
                        type: TABLE_CELL_TYPES.BUTTON,
                        style: {},
                        align: "center",
                        getButtonConfig: getActionButtonConfig,
                        onHandleClick: onActionClick
                    })
                    break;
                case USER_ROLES.TECH_TEAM.id:
                    tConfig.push({
                        heading: "Edit",
                        key: "edit",
                        type: TABLE_CELL_TYPES.BUTTON,
                        style: {},
                        align: "center",
                        getButtonConfig: getEditButtonConfig,
                        onHandleClick: onEditClick
                    })
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
                        heading: "Edit",
                        key: "edit",
                        type: TABLE_CELL_TYPES.BUTTON,
                        style: {},
                        align: "center",
                        getButtonConfig: getEditButtonConfig,
                        onHandleClick: onEditClick
                    })
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
        getTenderListApi(requestData).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setSearchKeys({ departmentId: departmentId, location: location, tenderId: tenderId })
                    setTenderList(res.data.data.tenderList);
                    setPageNum(res.data.data.currentPage);
                    setTotalCount(res.data.data.totalTenders);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Tender List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Tender List!!");
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
            {!isLoadingTable && tenderList.length === 0 ? (
                <Grid2 container size={{ xs: 12 }} spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <Alert severity="info">
                            {props.isVeiwAll ? 'No Projects created !!' : 'No Project work pending on you!!'}
                        </Alert>
                    </Grid2>
                </Grid2>
            ) : (
                <Grid2 container spacing={2}>
                    {!isLoadingTable && <Grid2 size={{ xs: 12 }}>
                        <CustomTableSearch filterType={props.isVeiwAll ? "all" : "worklist"}
                            handleSearch={handleSearch} />
                    </Grid2>}
                    <Grid2 size={{ xs: 12 }}>
                        <CustomTable isLoading={isLoadingTable} totalCount={totalCount} pageNum={pageNum}
                            tableConfig={tableConfig} rowList={tenderList} rowsPerPage={rowsPerPage}
                            getPaginationData={getPaginationData} />
                    </Grid2>
                </Grid2>
            )
            }
        </Box >
    );
};
