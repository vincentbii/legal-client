import { Drawer, Radio } from 'antd';
import React from 'react';
import SideMenu from './SideMenu';

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
                style={{ padding: 0 }}
                onClose={onClose}
                visible={open}
            >
                <SideMenu />
            </Drawer>
        );
    }
}

export default Side;