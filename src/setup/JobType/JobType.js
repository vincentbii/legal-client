import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Table, CircularProgress} from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getJobType, deleteJobType } from '../../util/APIUtils';
import { Button } from '@material-ui/core';

let rows = [];

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Job Type' },
    { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'Select all desserts' }}
                    />
                </TableCell>
                {headRows.map(row => (
                    <TableCell
                        key={row.id}
                        align={row.numeric ? 'right' : 'left'}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    progress: {
        margin: theme.spacing(2),
      },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const clases = useStyles();
    const { numSelected, destroy, addJobType } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
          </Typography>
                ) : (
                        <Typography variant="h6" id="tableTitle">
                            Job Types
          </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon onClick={destroy} />
                        </IconButton>
                    </Tooltip>
                ) : (
                        <Tooltip title="Add new Jobtype">
                            <Fab size='small' color="secondary" aria-label="Add" className={clases.fab}>
                                <Link to="/jobtype/new"><AddIcon /></Link>
                            </Fab>
                        </Tooltip>
                    )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
}));

class JobType extends Component {

    constructor(props) {
        super(props);
        this.classes = useStyles;
        this.state = {
            order: 'asc',
            orderBy: 'name',
            selected: [],
            page: 0,
            dense: true,
            rowsPerPage: 5,
            rows: [],
            headRows: headRows
        };

        this.handleRequestSort = this.handleRequestSort.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangeDense = this.handleChangeDense.bind(this);
        this.loadJobTypes = this.loadJobTypes.bind(this);
        this.destroy = this.destroy.bind(this);
        this.addJobType = this.addJobType.bind(this);
    }

    handleRequestSort(event, property) {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        this.setState({ order: isDesc ? 'asc' : 'desc' });
        this.setState({ orderBy: property });
    }

    handleSelectAllClick(event) {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.id);
            this.setState({ selected: newSelecteds });
            return;
        } else {
            this.setState({ selected: [] });
        }
    }

    handleClick(event, id) {
        const selectedIndex = this.state.selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(this.state.selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(this.state.selected.slice(1));
        } else if (selectedIndex === this.state.selected.length - 1) {
            newSelected = newSelected.concat(this.state.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                this.state.selected.slice(0, selectedIndex),
                this.state.selected.slice(selectedIndex + 1),
            );
        }
        this.setState({ selected: newSelected });
    }

    handleChangePage(event, newPage) {
        this.setState({ page: newPage });
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: +event.target.value });
    }

    handleChangeDense(event) {
        this.setState({ dense: event.target.checked });
    }

    addJobType(){

    }

    destroy() {
        const len = this.state.selected;
        if (len.length === 0) {
            alert('Select at least on item!');
        } else {
            deleteJobType(len)
                .then(res => {
                    setTimeout(() => {
                        this.setState({ rows: res });
                    }, 600);
                })
                .catch(error => {
                    console.error(error);
                });
                this.setState({ selected: [] });
        }
    }

    componentDidMount() {
        this.loadJobTypes();
    }

    loadJobTypes() {
        getJobType()
            .then(res => {
                this.state.rows = res.results;
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        const spin = [
            <CircularProgress className={this.classes.progress} />
        ];
        
        const { page, rowsPerPage, order, orderBy, selected, rows } = this.state;

        const isSelected = id => selected.indexOf(id) !== -1;

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
        return (
            <div className={this.classes.root}>
                
                <Paper className={this.classes.paper}>
                    <EnhancedTableToolbar destroy={this.destroy} numSelected={selected.length} />
                    <div className={this.classes.tableWrapper}>
                        <Table
                            className={this.classes.table}
                            aria-labelledby="tableTitle"
                            size='small'
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {stableSort(rows, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        onClick={event => this.handleClick(event, row.id)}
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell><Switch checked={row.active} /></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                {/* <FormControlLabel
                    control={<Switch checked={this.state.dense} onChange={this.handleChangeDense} />}
                    label="Dense padding"
                /> */}
            </div>
        );
    }
}


export default JobType;