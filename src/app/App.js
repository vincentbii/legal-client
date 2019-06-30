// import jwt_decode from "jwt-decode";
import { Layout, notification } from 'antd';
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AddClient from '../clients/AddClient';
import Clients from '../clients/Client';
import Header from '../common/header/Header';
import LoadingIndicator from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import Priorities from '../common/setup/Priorities/Priorities';
import Side from '../common/side/Side';
import Sidebar from '../common/sidebar/Sidebar';
import { ACCESS_TOKEN, APP_NAME } from '../constants';
import NewPoll from '../poll/NewPoll';
import JobType from '../setup/JobType/JobType';
import Nationalities from '../setup/Nationality/Nationalities';
import Religion from '../setup/Religion/Religion';
import Login from '../user/login/Login';
import Profile from '../user/profile/Profile';
import Signup from '../user/signup/Signup';
import { getCurrentUser } from '../util/APIUtils';
import './App.css';
import AddJobType from '../setup/JobType/Add';
import Department from '../setup/Department/Department';
import AddDepartment from '../setup/Department/Add';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      collapsed: true,
      open: false
    }
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  loadCurrentUser() {
    this.setState({
      isLoading: true
    });

    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push('/login');

    notification[notificationType]({
      message: APP_NAME,
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: APP_NAME,
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleDrawerOpen() {
    this.setState({ open: true });
  }

  handleDrawerClose() {
    this.setState({ open: false });
  }

  showDrawer = () => {
    this.setState({
      open: true,
    });
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    let SideBar = [];
    if (this.state.isAuthenticated) {
      SideBar = [
        <Sidebar
          collapsed={this.state.collapsed}
          toggleCollapsed={this.toggleCollapsed}
        />
      ]
    } else {
      SideBar = []
    }

    const { collapsed } = this.state;

    return (
      <Layout className="app-main">
        <Header
          showDrawer={this.showDrawer}
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          collapsed={collapsed}
          toggleCollapsed={this.toggleCollapsed}
          onLogout={this.handleLogout}
        />
        <Layout className="app-content">
          <Side
            showDrawer={this.showDrawer}
            open={this.state.open}
            onClose={this.onClose}
          />
          <Content className="">
            <div className="container">
              <Switch>
                <Route exact path="/"
                  render={(props) => <Clients isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />}>
                </Route>
                <Route path="/login"
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username"
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                </Route>

                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/jobtype/new" component={AddJobType} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/client/new" component={AddClient} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/priorities" component={Priorities} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/clients" component={Clients} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/nationality" component={Nationalities} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/department" component={Department} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/department/new" component={AddDepartment} handleLogout={this.handleLogout}></PrivateRoute>

                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/religion" component={Religion} handleLogout={this.handleLogout}></PrivateRoute>
                <PrivateRoute exact authenticated={this.state.isAuthenticated} path="/jobtype" component={JobType} handleLogout={this.handleLogout}></PrivateRoute>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(App);
