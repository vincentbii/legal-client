import { Button, Input, Table } from 'antd';
import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { deletePriority, getAllPriorities, updatePriority } from '../../../util/APIUtils';
import { test } from './columns';

export const EditableContext = React.createContext();

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

class Priorities extends Component {
    constructor(props) {
        super(props)
        this.state = {
            priorities: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            editingurl: ''
        }

        this.loadPriorities = this.loadPriorities.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.edit = this.edit.bind(this)
        this.cancel = this.cancel.bind(this)
        this.save = this.save.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.delete = this.delete.bind(this)
        this.renderColumns = this.renderColumns.bind(this)
        this.columns = test(this.state, this.renderColumns, this.edit, this.cancel, this.save, this.delete)
    }

    delete(url) {
        const newData = this.state.priorities;
        const target = newData.filter(item => url === item.url)[0];
        if (target) {
            deletePriority(target)
                .then(res => {
                    delete target.editable;
                    this.setState({ priorities: newData, res });
                    this.cacheData = res.map(item => ({ ...item }));
                })
                .catch()
        }
    }

    cancel(url) {
        const newData = this.state.priorities;
        const target = newData.filter(item => url === item.url)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => url === item.url)[0]);
            delete target.editable;
            this.setState({ data: newData });
        }
    };

    save(url) {
        const newData = this.state.priorities;
        const target = newData.filter(item => url === item.url)[0];
        const method = target.url === '' ? 'POST' : 'PATCH';
        if (target) {
            updatePriority(target, method)
                .then(res => {
                    delete target.editable;
                    this.setState({ priorities: newData, res });
                    // this.cacheData = res.map(item => ({ ...item }));
                })
                .catch()
        }
    }

    loadPriorities() {
        let promise = getAllPriorities();

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(res => {
                const priorities = this.state.priorities.slice();
                this.setState({
                    priorities: priorities.concat(res.results),
                    totalElements: res.count,
                    isLoading: false,
                })
                this.cacheData = res.results.map(item => ({ ...item }));

            })
            .catch(error => {
                this.setState({
                    isLoading: false
                })
            })
    }

    handleAdd = () => {
        const { totalElements, priorities } = this.state;
        const newData = {
            url: '',
            name: '',
            editable: true,
            active: true,
        };
        this.setState({
            priorities: [...priorities, newData],
            totalElements: totalElements + 1,
        });
    }

    edit(url) {
        const newData = this.state.priorities;
        const target = newData.filter(item => url === item.url)[0];
        if (target) {
            target.editable = true;
            this.setState({ data: newData });
        }
    }

    handleChange(value, url, column) {
        const newData = this.state.priorities;
        const target = newData.filter(item => url === item.url)[0];
        if (target) {
            target[column] = value;
            this.setState({ priorities: newData });
        }
    }

    componentDidMount() {
        this.loadPriorities();
    }

    renderColumns(text, record, column) {
        return (
            <EditableCell
                key={record.url}
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.url, column)}
            />
        );
    }


    render() {


        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>
                <Table
                    bordered
                    dataSource={this.state.priorities}
                    columns={this.columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                />
            </div>
        )
    }
}

export default withRouter(Priorities)