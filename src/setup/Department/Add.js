import { Button, CardActions, CardContent, TextField, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { notification } from 'antd';
import React, { Component } from 'react';
import { APP_NAME } from "../../constants";
import { updateDepartment } from '../../util/APIUtils';

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

class AddDepartment extends Component {
    constructor(props) {
        super(props)
        this.classes = useStyles;
        this.state = {
            name: ''
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            name: this.state.name
        };

        updateDepartment(data, 'POST')
            .then(res => {
                console.log(res);
                this.props.history.push("/department");
            })
            .catch(e => {
                notification.error({
                    message: APP_NAME,
                    description: e.messages[0]['message'] || 'Sorry! Something went wrong. Please try again!'
                });
            });
    }

    onChange(event) {
        let name = event.target.name;
        this.setState({ [name]: event.target.value });
    }
    render() {

        return (
            <Card className={this.classes.card}>
                <form onSubmit={this.handleSubmit} className={this.classes.container} noValidate autoComplete="off">
                    <CardContent>
                        <Typography className={this.classes.title} color="textSecondary" gutterBottom>
                            <TextField
                                id="name"
                                name="name"
                                onChange={this.onChange}
                                label="Department Name"
                                className={this.classes.textField}
                                margin="normal"
                            />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button type="submit" variant="contained" color="primary" className={this.classes.button}>
                            <SaveIcon className={this.classes.rightIcon}></SaveIcon>
                            Save
                        </Button>
                    </CardActions>
                </form>
            </Card>
        )
    }
}

export default AddDepartment;