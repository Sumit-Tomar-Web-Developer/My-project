import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TABLE_CELL_TYPES } from '../../Utils/Constants';
import TextTableCell from './CustomTableCells/TextTableCell';
import LinkTableCell from './CustomTableCells/LinkTableCell';
import ButtonTableCell from './CustomTableCells/ButtonTableCell';
import SkeletonTableCell from './CustomTableCells/SkeletonTableCell';
import { TableBody, TableCell, TableHead } from '@mui/material';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomTable(props) {
    let { isLoading, totalCount, pageNum, rowsPerPage, tableConfig, rowList, getPaginationData } = props;

    // Avoid a layout jump when reaching the last page with empty rowList.
    const emptyRows = pageNum > 0 ? Math.max(0, (1 + pageNum) * rowsPerPage - totalCount) : 0;

    const handleChangePage = (e, newPageNum) => {
        e.preventDefault();
        getPaginationData(newPageNum, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        event.preventDefault();
        let selectedValue = parseInt(event.target.value, 10);
        getPaginationData(0, selectedValue);
    };

    const createTableCell = (rowIndex, row, colIndex, colData) => {
        switch (colData.type) {
            case TABLE_CELL_TYPES.TEXT:
                return (<TextTableCell key={rowIndex + "_" + colIndex} row={row} colData={colData} />)
            case TABLE_CELL_TYPES.LINK:
                return (<LinkTableCell key={rowIndex + "_" + colIndex} rowIndex={rowIndex} row={row} colData={colData} />)
            case TABLE_CELL_TYPES.BUTTON:
                return (<ButtonTableCell key={rowIndex + "_" + colIndex} rowIndex={rowIndex} row={row} colData={colData} />)
            default:
                return ""
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="Table">
                <TableHead>
                    <TableRow>
                        {tableConfig.map((colData) => (
                            <TableCell
                                align="center"
                                key={colData.heading}
                                sx={(theme) => ({
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.44)' : theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    fontSize: "0.9rem",
                                    fontWeight: 500,
                                    borderLeft: `0.01rem solid ${theme.palette.divider}`,
                                })}
                            >
                                {colData.heading}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading && ([...Array(rowsPerPage)].map((row, rowIndex) => (
                        <TableRow key={"default_" + rowIndex}>
                            {tableConfig.map((colData, colIndex) => (
                                <SkeletonTableCell key={rowIndex + "_" + colIndex} style={colData.style} align={colData.align} />
                            ))}
                        </TableRow>
                    ))
                    )}
                    {!isLoading && rowList.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {tableConfig.map((colData, colIndex) => (
                                createTableCell(rowIndex, row, colIndex, colData)
                            ))}
                        </TableRow>
                    ))}
                    {!isLoading && emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={tableConfig.length} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={pageNum}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

CustomTable.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
    pageNum: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    tableConfig: PropTypes.array.isRequired,
    rowList: PropTypes.array.isRequired,
    getPaginationData: PropTypes.func.isRequired
};