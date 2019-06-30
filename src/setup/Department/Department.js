import MaterialTable, { MTableToolbar } from 'material-table';
import React, { Component } from 'react';
import {
    ViewColumn, Search, SaveAlt, Remove, LastPage, FirstPage, FilterList, Edit, DeleteOutline, Clear, ChevronLeft,
    ChevronRight, Check, ArrowUpward, AddBox
} from '@material-ui/icons';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { Switch, MuiThemeProvider, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom';
import { getDepartment, updateNationality, deleteNationality } from '../../util/APIUtils';

const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowUpward,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn
};

const useStyles = makeStyles(theme => ({
    fab: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

class Department extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            columns: [
                { title: 'Name', field: 'name' },
                {
                    title: 'Active',
                    field: 'active',
                    lookup: { true: 'Active', false: 'Not Active' },
                    render: rowData => <Switch checked={rowData.active} />
                },
            ],
            data: [],
        }

        this.theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#4caf50',
                },
                secondary: {
                    main: '#ff9100',
                },
            },

        });

        this.classes = useStyles;

        this.loadDepartment = this.loadDepartment.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
    }

    addNewRow() {
        alert('Here?');
    }

    loadDepartment() {
        getDepartment()
            .then(res => {
                this.setState({ data: res.results });
            })
            .catch();
    }

    componentDidMount() {
        this.loadDepartment();
    }

    render() {
        return (
            <MuiThemeProvider theme={this.theme}>
                <MaterialTable
                    title="Department"
                    columns={this.state.columns}
                    components={{
                        Toolbar: props => (
                            <div>
                                <MTableToolbar {...props} />
                                <div style={{ padding: '0px 10px' }}>
                                    <Fab color="primary" aria-label="Add" className={this.classes.fab}>
                                        <Link to="/department/new"><AddIcon /></Link>
                                    </Fab>
                                </div>
                            </div>
                        ),
                    }}
                    data={this.state.data}
                    icons={tableIcons}
                    editable={{
                        onRowAdd: newData =>
                            new Promise(resolve => {
                                updateNationality(newData, 'POST')
                                    .then(res => {
                                        setTimeout(() => {
                                            resolve();
                                            const data = [...this.state.data];
                                            data.push(res);
                                            this.setState({ data: data });
                                        }, 600);
                                    })
                                    .catch(error => {
                                        setTimeout(() => {
                                            resolve();
                                            console.log(error);
                                        }, 600);
                                    });
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise(resolve => {
                                updateNationality(newData, 'PATCH')
                                    .then(res => {
                                        setTimeout(() => {
                                            resolve();
                                            const data = [...this.state.data];
                                            data[data.indexOf(oldData)] = res;
                                            this.setState({ data: data });
                                        }, 600);
                                    })
                                    .catch(error => {
                                        setTimeout(() => {
                                            resolve();
                                            console.log(error);
                                        }, 600);
                                    });
                            }),
                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                deleteNationality(oldData.url)
                                    .then(res => {
                                        console.log(res)
                                        setTimeout(() => {
                                            resolve();
                                            const data = [...this.state.data];
                                            data.splice(data.indexOf(oldData), 1);
                                            this.setState({ data: data });
                                        }, 600);
                                    })
                                    .catch(error => {
                                        setTimeout(() => {
                                            resolve();
                                            const data = [...this.state.data];
                                            data.splice(data.indexOf(oldData), 1);
                                            this.setState({ data: data });
                                        }, 600);
                                    });

                            })
                    }}
                />
            </MuiThemeProvider>
        );
    }
}

export default Department;