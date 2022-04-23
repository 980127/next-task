/* eslint-disable no-nested-ternary */
import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { Typography, Box, TableSortLabel, CircularProgress } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { visuallyHidden } from '@mui/utils';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F7F7F7',
    color: '#828282',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const tableRows = [
  {
    name: '01/01/20',
    ticker: 'ABC Pvt ltd',
    marketType: 'High',
    change: '+6.0',
    changeValue: 6,
    changeType: 'plus',
    last: 24
  },
  {
    name: '01/01/20',
    ticker: 'ABC Pvt ltd',
    marketType: 'High',
    change: '-5.0',
    changeValue: -5,
    changeType: 'plus',
    last: 21
  },
  {
    name: '01/01/20',
    ticker: 'ABC Pvt ltd',
    marketType: 'Low',
    change: '+2.0',
    changeValue: 2,
    changeType: 'minus',
    last: 17
  },
  {
    name: '01/01/20',
    ticker: 'ABC Pvt ltd',
    marketType: 'High',
    change: '+4.0',
    changeValue: 4,
    changeType: 'minus',
    last: 65
  },
  {
    name: '01/01/20',
    ticker: 'ABC Pvt ltd',
    marketType: 'Low',
    change: '-1.0',
    changeValue: -1,
    changeType: 'plus',
    last: 20
  }
];

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0
//   }
// }));

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
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
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
  rowsPerPage: PropTypes.number.isRequired
};

export default function ResultTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [selected, setSelected] = React.useState();

  React.useEffect(() => {
    if (props.isResultLoading) {
      setRows(tableRows);
    }
  }, [props.isResultLoading]);

  // Avoid a layout jump when reaching the last page with empty rows.

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // const isAsc = order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  // const isSelected = (name) => selected.indexOf(name) !== -1;
  const [orderBy, setOrderBy] = React.useState('calories');

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="customized table">
        <TableHead sx={{ justifyContent: 'center' }}>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell sx={{ minWidth: '200px' }}>Ticker</StyledTableCell>
            <StyledTableCell sx={{ minWidth: '150px' }}>
              <TableSortLabel active direction={order} onClick={createSortHandler('changeValue')}>
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              </TableSortLabel>
              change
            </StyledTableCell>
            <StyledTableCell
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: '20px',
                  margin: '10px 5px 0 -30px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FilterListOutlinedIcon size="small" sx={{ fontSize: '14px', minHeight: '20px', color: '#BDBDBD' }} />
              </Box>
              {/* <Typography as="span" sx={{ fontWeight: '700', fontSize: '12px', lineHeight: 1.5 }}> */}
              Last
              {/* </Typography> */}
              <TableSortLabel active direction={order} onClick={createSortHandler('last')}>
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              </TableSortLabel>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        {props?.isResultLoading ? (
          <>
            <StyledTableCell />
            <Box
              as="div"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginTop: '40px'
              }}
            >
              <CircularProgress />
            </Box>
          </>
        ) : _.isEmpty(rows) ? (
          <>
            <StyledTableCell />
            <Typography sx={{ marginTop: 1, fontWeight: 700, textAlign: 'center' }}>
              Run screener to see results
            </Typography>
          </>
        ) : (
          <>
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={`rowIndex${index}`}>
                    <StyledTableCell sx={{ fontSize: '14px', lineHeight: '21px' }}>{row.name}</StyledTableCell>
                    <StyledTableCell
                      sx={{
                        display: ' flex',
                        flesDirectin: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        fontSize: '14px',
                        lineHeight: '21px'
                      }}
                    >
                      <Box sx={{ fontSize: '14px', lineHeight: '21px' }}> {row.ticker}</Box>
                      <Box
                        sx={
                          row.marketType === 'High'
                            ? {
                                color: '#EDAF2D',
                                backgroundColor: 'rgba(237, 175, 45, 0.1)',
                                padding: '6px 8px 7px',
                                fontSize: '12px',
                                lineHeight: '15px',
                                marginLeft: '18px',
                                borderRadius: '4px'
                              }
                            : {
                                color: '#2DB5EF',
                                backgroundColor: 'rgba(45, 181, 239, 0.1)',
                                padding: '6px 8px 7px',
                                fontSize: '12px',
                                lineHeight: '15px',
                                marginLeft: '18px',
                                borderRadius: '4px'
                              }
                        }
                      >
                        {row.marketType} market cap
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={[
                        row.changeType === 'plus' ? { color: '#27AE60' } : { color: '#EB5757' },
                        { fontSize: '14px', lineHeight: '21px', fontWeight: '500' }
                      ]}
                    >
                      {row.change}
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: '14px', lineHeight: '21px' }}>{row.last}</StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={4}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page'
                    },
                    native: true
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </>
        )}
      </Table>
    </TableContainer>
  );
}
