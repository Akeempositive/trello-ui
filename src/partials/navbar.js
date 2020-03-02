
import React, { Component } from 'react';
// import {hasAuthority} from  '../utils/api-utils'

import {
    Link,
    Redirect,
  } from "react-router-dom";
import { stateManager } from '../utils/state-utils';
import {USER} from '../constants'

class Header extends Component  {
    constructor(props) {
        super(props);
        this.onSubmitExperience = this.onSubmitExperience.bind(this);
        this.state = {
            user : null
        }
    }

    componentDidMount(){
    
    }

    onSubmitExperience = (e) => {
        e.preventDefault();
    }

    setRoute=(path)=>{
        this.setState({redirectMe: {
                status:true,
                path:`/${path}`
            }
        })
    }

    seeWeeklyReportPriviledge = () => {
        this.state.user = JSON.parse(stateManager(USER))
        //this.setState({user : JSON.parse(stateManager(USER))})
        if(this.state.user && !this.state.user.submittedWeeklyReport && this.state.user.role.name.indexOf('Manager')> -1 ){//&& !this.state.user.submittedWeeklyReport){
            return (
                <Link to={`/weekly-report`}><i className="fa fa-card"></i>Submit Reports</Link>
            )
        }
    }

  render() {
    return (
        // <!-- Left Panel -->
        <aside id="left-panel" class="left-panel">
            <nav class="navbar navbar-expand-sm navbar-default">

                <div class="navbar-header">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa fa-bars"></i>
                    </button>
                    <a class="navbar-brand" href="./"><h5>MCS BOARD</h5></a>
                </div>

                <div id="main-menu" class="main-menu collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                           
                        
                                 {/* <!-- /.menu-title --> */}
                            <li class="menu-item-has-children dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-laptop"></i>Actions</a>
                                <ul class="sub-menu children dropdown-menu">
                                    <li>
                                        <Link to={`/tasks`} ><i className="fa fa-puzzle-piece"></i>Task</Link>
                                        <Link to={`/users`}><i className="fa fa-people"></i>Users</Link>
                                        {this.seeWeeklyReportPriviledge()}
                                    </li>
                                    {/* <li><i class="fa fa-puzzle-piece"></i><a href="ui-buttons.html">Buttons</a></li>
                                    <li><i class="fa fa-id-badge"></i><a href="ui-badges.html">Badges</a></li>
                                    <li><i class="fa fa-bars"></i><a href="ui-tabs.html">Tabs</a></li> */}
                                    
                                </ul>
                            </li>
                            
                        
                        
                        
                        
                        {/* {
                            hasAuthority(["ROLE_ADMIN"])
                            ?
                                <h3 class="menu-title">Admin</h3>
                            :
                            ""

                        }
                        {
                            hasAuthority(["ROLE_ADMIN"])
                            ?
                            <li class="menu-item-has-children dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-tasks"></i>Actions</a>
                                <ul class="sub-menu children dropdown-menu">
                                    <li>
                                        <Link to={`/users`} ><i className="fa fa-puzzle-piece"></i>Users</Link>
                                    </li>
                                    <li>
                                        <Link to={`/audit-trails`} ><i className="fa fa-puzzle-piece"></i>Audit</Link>
                                    </li>
                                </ul>
                            </li>
                            :
                            ""
                        } */}

                        {/* <h3 class="menu-title">Admin</h3> */}
                        {/* <!-- /.menu-title --> */}

                        
                        
                        
                    </ul>
                </div>
                {/* <!-- /.navbar-collapse --> */}
            </nav>
        </aside>
        
        /* <!-- /#left-panel --> */
    
    );
  }
}

export default Header;




