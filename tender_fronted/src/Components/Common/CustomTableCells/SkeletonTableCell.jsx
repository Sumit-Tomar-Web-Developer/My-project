import PropTypes from 'prop-types';
import { Skeleton, TableCell } from "@mui/material";

export default function SkeletonTableCell(props) {
    return (
        <TableCell style={props.style} align={props.align}>
            <Skeleton animation="wave" variant="text" />
        </TableCell>
    )
}

SkeletonTableCell.prototype = {
    style: PropTypes.object.isRequired,
    align: PropTypes.string.isRequired,
}