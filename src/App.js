import React, {Component} from 'react';
import './App.css';
import {Route, withRouter,HashRouter} from 'react-router-dom';
import ProtectedRoute from './common/ProtectedRoute';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
// import Dashboard from './pages/doctor/dashboardpage/dashboard'
import TaskPage from './pages/tasks/dashboard'
import Drugpage from './pages/doctor/drugpage/drug'
import AuditTrailPage from './pages/doctor/auditTrail/auditTrail'
import UserPage from './pages/doctor/user/userpage'
import UserInfoPage from './pages/doctor/userinfo/userinfo'
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
                {/* <Route exact path='/sign-up' component={Signup} /> */}
                <Route exact path='/tasks' component={TaskPage} />
                <Route exact path='/weekly-report' component={WeeklyReportPage} />
                <Route exact path="/users" component={UserPage} />

                
                {/* <ProtectedRoute exact path="/dashboard" component={Dashboard} /> */}
                {/* <ProtectedRoute exact path="/drug" component={Drugpage} />
                <ProtectedRoute exact path="/audit-trails" component={AuditTrailPage} />
                <ProtectedRoute exact path="/users" component={UserPage} />
                <ProtectedRoute exact path='/single-user/:userId' component={UserInfoPage} /> */}

            </HashRouter>

        
        );

    }
}

export default withRouter(App);
