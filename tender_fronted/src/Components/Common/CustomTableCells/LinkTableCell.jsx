import { TableCell } from "@mui/material";
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import { getKeyValue } from "../../../Utils/UtilityFunctions";

export default function LinkTableCell({ row, colData, rowIndex }) {
    let cellValue = getKeyValue(colData, row);
    let cellData = colData.valueFunc ? colData.valueFunc(cellValue) : cellValue;
    cellData = colData.preText ? colData.preText + cellData : cellData;
    return (
        <TableCell style={colData.style} align={colData.align}>
            <Link
                component="button"
                variant="body2"
                sx={{ textDecoration: "none", color: "secondary.main", fontWeight: "bold" }}
                onClick={(e) => {
                    colData.onHandleClick(e, rowIndex);
                }}
            >
                {cellData}
            </Link>
        </TableCell>
    )
}

LinkTableCell.prototype = {
    row: PropTypes.object.isRequired,
    colData: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired
}