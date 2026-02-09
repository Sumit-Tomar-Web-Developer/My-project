import { Chip } from "@mui/material";
import PropTypes from 'prop-types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { TOOL_API_URL } from "../../AppApis/APIUrls";

export default function CustomFileDownload(props) {
    if (props.isedit) {
        return (
            <Chip
                color='secondary'
                component="a" href={`${TOOL_API_URL}/files/${props.guid}/${props.projectID}`} clickable
                download target="_blank" rel="noreferrer" underline="none"
                key={props.fileName}
                label={props.fileName}
                onDelete={(e) => props.handleFileUnselect(e, props.fileName)}
                style={{ margin: '5px' }}
            />
        )
    }
    else {
        return (
            <Chip
                icon={<FileDownloadIcon />}
                color='secondary'
                component="a" href={`${TOOL_API_URL}/files/${props.guid}/${props.projectID}`} clickable
                download target="_blank" rel="noreferrer" underline="none"
                key={props.fileName}
                label={props.fileName}
                style={{ margin: '5px' }}
                variant="outlined"
            />
        )
    }
}

CustomFileDownload.propTypes = {
    isedit: PropTypes.bool.isRequired,
    guid: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    projectID: PropTypes.number.isRequired,
    handleFileUnselect: PropTypes.func
}