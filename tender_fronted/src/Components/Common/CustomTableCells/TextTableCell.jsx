import PropTypes from 'prop-types';
import { TableCell } from "@mui/material";
import { getKeyValue } from '../../../Utils/UtilityFunctions';

export default function TextTableCell({ row, colData }) {
    let cellValue = getKeyValue(colData, row);
    let cellData = colData.valueFunc ? colData.valueFunc(cellValue) : cellValue;
    cellData = colData.preText ? colData.preText + cellData : cellData;
    return (
        <TableCell style={colData.style} align={colData.align}>
            {cellData}
        </TableCell>
    )
}

TextTableCell.prototype = {
    row: PropTypes.object.isRequired,
    colData: PropTypes.object.isRequired
}