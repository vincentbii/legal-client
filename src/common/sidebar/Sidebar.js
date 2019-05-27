import { Icon, Layout, Menu } from 'antd';
import 'antd/lib/menu/style/css';
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Sidebar extends Component {
    state = {
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const { collapsed, toggleCollapsed } = this.props;
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub2']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="mail" />
                                <span>Administration</span>
                            </span>
                        }
                    >
                        <Menu.Item key="5">Add Login</Menu.Item>
                        <Menu.Item key="6">System Admnistrators</Menu.Item>
                        <Menu.Item key="7">Users</Menu.Item>
                        <Menu.Item key="8">Approvers</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="setting" />
                                <span>Setup</span>
                            </span>
                        }
                    >
                        <Menu.Item key="9">States</Menu.Item>
                        <Menu.Item key="10">Job Type</Menu.Item>
                        {/* <SubMenu key="sub3" title="Submenu">
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu> */}
                        <Menu.Item key="13">
                            <Link to="/priorities/">Priorities</Link>
                        </Menu.Item>
                        <Menu.Item key="14">Request Type</Menu.Item>
                        <Menu.Item key="15"><Link to="/casestatus">Case Status</Link></Menu.Item>
                        <Menu.Item key="16">Department</Menu.Item>
                        <Menu.Item key="17"><Link to="/religion">Religion</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default Sidebar