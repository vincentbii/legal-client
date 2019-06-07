import React, { Component } from "react";
import { TextField, Button, Card, CardContent, CardActions, Select, Typography, InputLabel } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { notification } from 'antd';
import clsx from 'clsx';
import { useStyles } from './styles';
import { updateClient } from "../util/APIUtils";
import { APP_NAME } from "../constants";

class AddClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            gender: ''
        };
        this.classes = useStyles;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let last_name = this.state.last_name;
        let first_name = this.state.first_name;
        let initials = first_name[0] + last_name[0];
        const data = {
            first_name: first_name,
            last_name: last_name,
            gender: this.state.gender,
            initials: initials
        };

        updateClient(data, 'POST')
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                notification.error({
                    message: APP_NAME,
                    description: error.messages[0]['message'] || 'Sorry! Something went wrong. Please try again!'
                });
            });

        console.log(data);
    }

    handleChange(event) {
        let name = event.target.name;
        this.setState({ [name]: event.target.value });
    }


    render() {
        return (
            <div>
                <Card className={this.classes.card}>
                    <form onSubmit={this.handleSubmit} className={this.classes.container} noValidate autoComplete="off">
                        <CardContent>
                            <Typography>
                                <TextField
                                    id="first_name"
                                    name="first_name"
                                    label="First Name"
                                    className={this.classes.textField}
                                    // value={values.name}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />

                                <TextField
                                    id="last-name"
                                    label="Last Name"
                                    name="last_name"
                                    className={this.classes.textField}
                                    // value={values.name}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />
                            </Typography>

                            <Typography>
                                <InputLabel htmlFor="gender">Gender</InputLabel>
                                <Select
                                    native
                                    label='Gender'
                                    // value={state.age}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: 'gender',
                                        id: 'gender',
                                    }}
                                >
                                    <option value="" />
                                    <option value='M'>Male</option>
                                    <option value='F'>Female</option>
                                </Select>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button type="submit" variant="contained" color="primary" size="small" className={this.classes.button}>
                                <SaveIcon className={clsx(this.classes.leftIcon, this.classes.iconSmall)} />
                                Save
                            </Button>
                        </CardActions>

                    </form>
                </Card>
            </div>
        )
    }
}

export default AddClient;