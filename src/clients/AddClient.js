import { Button, TextField, Typography, InputLabel, Select, FormControl } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
}));

const gender = [
    {
        value: 'M',
        label: 'Male',
    },
    {
        value: 'F',
        label: 'Female',
    },
];

export default function AddClient() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        age: '',
        gender: ''
    });

    const handleChange = e => {
        let id = e.target.id;
        setValues({ ...values, [id]: e.target.value });
        console.log(id + '<>' + e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let form = document.getElementsByName('client_form');

        let data = {};

        for (let i = 0; i < form.length; i++) {
            let id = form[i].id;
            let value = form[i].value;
            data[id] = value;
        }

        console.log(data);

    }

    return (
        <form onSubmit={handleSubmit} className={classes.container} noValidate autoComplete="off">

            <Typography>

                <TextField
                    required
                    id="first_name"
                    name="client_form"
                    label="First Name"
                    onChange={handleChange}
                    className={clsx(classes.textField, classes.dense)}
                    margin="dense"
                />

                <TextField
                    required
                    id="last_name"
                    name="client_form"
                    label="Last Name"
                    onChange={handleChange}
                    className={clsx(classes.textField, classes.dense)}
                    margin="dense"
                />
                <TextField
                    id="email"
                    name="client_form"
                    label="Email Address"
                    placeholder="admin@example.com"
                    onChange={handleChange}
                    className={clsx(classes.textField, classes.dense)}
                    margin="dense"
                />
                <FormControl className={clsx(classes.textField, classes.dense)}>
                    <InputLabel htmlFor="gender">Gender</InputLabel>
                    <Select
                        native
                        onChange={handleChange}
                        inputProps={{
                            name: 'client_form',
                            id: 'gender',
                        }}
                    >
                        <option value="" />
                        <option value='M'>Make</option>
                        <option value='F'>Female</option>
                    </Select>
                </FormControl>
            </Typography>
            <Typography>

                <Button type="submit" variant="contained" color="secondary" size="small">
                    <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />Save
                </Button>

            </Typography>

        </form>
    );
}
