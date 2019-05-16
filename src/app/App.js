// import jwt_decode from "jwt-decode";
import { Layout, notification } from 'antd';
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import Sidebar from '../common/sidebar/Sidebar';
import { ACCESS_TOKEN, APP_NAME } from '../constants';
import NewPoll from '../poll/NewPoll';
import PollList from '../poll/PollList';
import Login from '../user/login/Login';
import Profile from '../user/profile/Profile';
import Signup from '../user/signup/Signup';
import { getCurrentUser } from '../util/APIUtils';
import './App.css';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      collapsed: true
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
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
          isLoading: false
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

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Polling App',
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
    }

    const { collapsed } = this.state;

    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          collapsed={collapsed}
          toggleCollapsed={this.toggleCollapsed}
          onLogout={this.handleLogout} />

        <Layout className="app-content">
          {SideBar}
          <Content className="">
            <div className="container">
              <Switch>
                <Route exact path="/"
                  render={(props) => <PollList isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />}>
                </Route>
                <Route path="/login"
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username"
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                </Route>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={this.handleLogout}></PrivateRoute>
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
