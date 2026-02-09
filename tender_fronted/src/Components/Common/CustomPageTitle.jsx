import { Typography } from "@mui/material";
import PropTypes from 'prop-types';

export default function CustomPageTitle(props) {
    return (
        <Typography 
            color="text.primary" 
            variant="h6" 
            sx={{ fontWeight: 550, paddingBottom: "0.5rem" }} 
            gutterBottom
        >
            {props.title}
        </Typography>
    );
}

CustomPageTitle.prototype = {
    title: PropTypes.string
}