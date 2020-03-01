import React, {Component} from 'react';
import './App.css';
import {Route, withRouter,HashRouter} from 'react-router-dom';
import ProtectedRoute from './common/ProtectedRoute';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import TaskPage from './pages/tasks/dashboard'
import UserPage from './pages/user/userpage'
import SettingPage from './pages/settings'
import WeeklyReportPage from './pages/weekly-report';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isLoading: false
        };
    }

    
    

    render() {

        return (

            <HashRouter>
                <Route exact path='/' component={Login} />
                <Route exact path='/tasks' component={TaskPage} />
                <Route exact path='/weekly-report' component={WeeklyReportPage} />
                <Route exact path="/users" component={UserPage} />
                <Route exact path="/settings" component={SettingPage} />
            </HashRouter>

        
        );

    }
}

export default withRouter(App);
