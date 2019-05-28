import { Button, Drawer, Radio } from 'antd';
import React from 'react';

const RadioGroup = Radio.Group;

class Side extends React.Component {

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const placement = 'left';
        const { open, onClose } = this.props;
        return (
            <Drawer
                title="Sidebar Menu"
                placement={placement}
                closable={false}
                onClose={onClose}
                visible={open}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        );
    }
}

export default Side;