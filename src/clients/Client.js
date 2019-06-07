import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { getClient } from '../util/APIUtils';
import AddClient from './AddClient';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        margin: theme.spacing(1),
    },
    paper: {
        marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
}));

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            rows: [],
            data: [],
            addingClient: false
        }

        this.classes = useStyles;

        this.loadClients = this.loadClients.bind(this);
        this.addClient = this.addClient.bind(this);
    }

    addClient() {
        this.setState({ addingClient: true })
    }

    loadClients() {
        getClient()
            .then(res => {
                this.setState({ rows: res.results });
            })
            .catch();
    }

    componentDidMount() {
        this.loadClients();
    }

    render() {
        return (
            <div className={this.classes.root}>
                {this.state.addingClient ?
                    <AddClient addingClient={this.state.addingClient} /> :
                    <div>
                        <Button variant="contained" color="primary" onClick={this.addClient} className={this.classes.button}>
                            Add
                    </Button>
                        <Paper className={this.classes.paper}>
                            <Table className={this.classes.table} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.rows.map(row => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.first_name + ' ' + row.last_name}
                                            </TableCell>
                                            <TableCell align="right">{row.gender}</TableCell>
                                            <TableCell align="right">{row.active}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                }

            </div>
        );
    }
}

export default Clients;