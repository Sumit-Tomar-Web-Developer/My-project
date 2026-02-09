import PropTypes from 'prop-types';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PolicyIcon from '@mui/icons-material/Policy';
import StreamIcon from '@mui/icons-material/Stream';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ViewListIcon from '@mui/icons-material/ViewList';
import TaskIcon from '@mui/icons-material/Task';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ListIcon from '@mui/icons-material/List';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddTaskIcon from '@mui/icons-material/AddTask';
import GavelIcon from '@mui/icons-material/Gavel';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import PageviewIcon from '@mui/icons-material/Pageview';
import LocalMallIcon from '@mui/icons-material/LocalMall';

export default function CustomTag(props) {
    const getTagName = () => {
        switch (props.tagName) {
            case "TroubleshootIcon":
                return TroubleshootIcon;
            case "PeopleAltIcon":
                return PeopleAltIcon;
            case "TaskIcon":
                return TaskIcon;
            case "InsightsIcon":
                return InsightsIcon;
            case "AssessmentIcon":
                return AssessmentIcon;
            case "AssignmentIcon":
                return AssignmentIcon;
            case "CloudDownloadIcon":
                return CloudDownloadIcon;
            case "PolicyIcon":
                return PolicyIcon;
            case "StreamIcon":
                return StreamIcon;
            case "AdbIcon":
                return AdbIcon;
            case "AccountCircleIcon":
                return AccountCircleIcon;
            case "LogoutIcon":
                return LogoutIcon;
            case "PersonIcon":
                return PersonIcon;
            case "LoginIcon":
                return LoginIcon;
            case "EditIcon":
                return EditIcon;
            case "DeleteIcon":
                return DeleteIcon;
            case "HomeIcon":
                return HomeIcon;
            case "PostAddIcon":
                return PostAddIcon;
            case "ViewListIcon":
                return ViewListIcon;
            case "DashboardIcon":
                return DashboardIcon;
            case "CheckCircleIcon":
                return CheckCircleIcon;
            case "SpaceDashboardIcon":
                return SpaceDashboardIcon;
            case "LocationCityIcon":
                return LocationCityIcon;
            case "ListIcon":
                return ListIcon;
            case "DoneAllIcon":
                return DoneAllIcon;
            case "BeenhereIcon":
                return BeenhereIcon;
            case "BorderColorIcon":
                return BorderColorIcon;
            case "UploadFileIcon":
                return UploadFileIcon;
            case "AddTaskIcon":
                return AddTaskIcon;
            case "GavelIcon":
                return GavelIcon;
            case "WorkOutlineIcon":
                return WorkOutlineIcon;
            case "VerifiedIcon":
                return VerifiedIcon;
            case "WorkIcon":
                return WorkIcon;
            case "BusinessCenterIcon":
                return BusinessCenterIcon;
            case "FolderSpecialIcon":
                return FolderSpecialIcon;
            case "AccountBalanceIcon":
                return AccountBalanceIcon;
            case "AssuredWorkloadIcon":
                return AssuredWorkloadIcon;
            case "SummarizeIcon":
                return SummarizeIcon;
            case "ContentPasteSearchIcon":
                return ContentPasteSearchIcon;
            case "IntegrationInstructionsIcon":
                return IntegrationInstructionsIcon;
            case "PageviewIcon":
                return PageviewIcon;
            case "LocalMallIcon":
                return LocalMallIcon;
            default:
                return;
        }
    }

    const TagName = getTagName();

    return <TagName color={props.color} fontSize="small" style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }} />
}

CustomTag.propTypes = {
    tagName: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
}