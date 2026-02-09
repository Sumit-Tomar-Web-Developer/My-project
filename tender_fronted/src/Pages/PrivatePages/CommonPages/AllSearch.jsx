import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Tabs,
    Tab,
    Badge,
} from "@mui/material";
import CustomPageTitle from "../../../Components/Common/CustomPageTitle";
import CustomTabPanel from "./CustomTabPanel";
import TenderSearch from "./TenderSearch";
import ExpenseSearch from "./ExpenseSearch";
import { getWorkListCountApi, getWorkListExpenseCountApi } from "../../../AppApis/ApiFunctions";
import { API_STATUS } from "../../../Utils/Constants";


export default function AllSearch(props) {
    const [tabValue, setTabValue] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [projectCount, setProjectCount] = useState(0);
    const [expenseCount, setExpenseCount] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        setSearchParams({ tab: newValue.toString() });
    };

    useEffect(() => {
        let tabId = searchParams.get('tab');
        if (tabId === '1') {
            setTabValue(1);
        } else {
            setTabValue(0);
        }
        if (!props.isVeiwAll) {
            getWorkListCountApi({}).then(res => {
                if (res.data && res.data.type === API_STATUS.SUCCESS) setProjectCount(res.data.data);
            });
            getWorkListExpenseCountApi({}).then(res => {
                if (res.data && res.data.type === API_STATUS.SUCCESS) setExpenseCount(res.data.data);
            });
        }
    }, [props.isVeiwAll, searchParams.get('tab')]);

    return (
        <Box>
            <CustomPageTitle title={props.isVeiwAll ? (tabValue === 0 ? "Project List" : "Expense List") : "My WorkList"} />
            <Tabs value={tabValue} onChange={handleChange} aria-label="Project Tab">
                <Tab label={
                    props.isVeiwAll
                        ? <b>Projects</b>
                        : <Badge badgeContent={projectCount} color="secondary">
                            <span style={{ marginTop: "8px", marginRight: "8px" }}><b>Projects</b></span></Badge>
                } id="tab-0" aria-controls="tabpanel-0" />
                <Tab label={
                    props.isVeiwAll
                        ? <b>Expenses</b>
                        : <Badge badgeContent={expenseCount} color="secondary">
                            <span style={{ marginTop: "8px", marginRight: "8px" }}><b>Expenses</b></span></Badge>
                } id="tab-1" aria-controls="tabpanel-1"></Tab>
            </Tabs>
            <CustomTabPanel value={tabValue} index={0}>
                <TenderSearch {...props} />
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
                <ExpenseSearch {...props} />
            </CustomTabPanel>
        </Box >
    );
};
