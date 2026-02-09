import { TableCell } from "@mui/material";
import PropTypes from 'prop-types';
import CustomButton from "../CustomButton";
import CustomTag from "../CustomTag";

export default function ButtonTableCell({ row, colData, rowIndex }) {

    let buttonConfig = colData.getButtonConfig(row);
    if (buttonConfig === null) {
        return (
            <TableCell style={colData.style} align={colData.align}>

            </TableCell>
        )
    }
    else {
        return (
            <TableCell style={colData.style} align={colData.align}>
                <CustomButton
                    position="center"
                    color={buttonConfig.color}
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                        colData.onHandleClick(e, rowIndex);
                    }}
                    endIcon={<CustomTag color={buttonConfig.color} tagName={buttonConfig.icon} />}
                >
                    {buttonConfig.value}
                </CustomButton>
            </TableCell>
        )
    }
}

ButtonTableCell.prototype = {
    row: PropTypes.object.isRequired,
    colData: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired
}