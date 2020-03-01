import React, { Component } from 'react';
import {
    Form,
    Input,
    Icon,
    Spin,
    notification
  } from 'antd';
  
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import {resetPassword} from './settings-api'
import {USERID} from '../../constants'
import {stateManager} from '../../utils/state-utils'
 
  const FormItem = Form.Item;

class SettingPage extends Component  {
    constructor(props) {
        super(props);
        this.state={
            isloading:false,
            resetPassword: '',
        }

    }

    resetPassword = () => {
        if(this.state.resetPassword.newPassword !== this.state.resetPassword.newPassword2){
            notification['error']({
                message: 'MCS',
                description:
                    `Your new password does not match each other.`,
                });
            return;
        }
        this.setState({isloading : true});
        this.state.resetPassword = {...this.state.resetPassword, userId : stateManager(USERID)}
        resetPassword(this.state.resetPassword)
        .then(response=> {
            if(response.successful){
                notification['success']({
                    message: 'MCS',
                    description:
                        `Your password is successfully changed.`,
                    });
            }else if(response.message) {
                notification['error']({
                    message: 'MCS',
                    description:
                        `Your password can not be changed.`,
                    });
                notification['error']({
                    message: 'MCS',
                    description:
                        response.message,
                    });
            }else {
                notification['error']({
                    message: 'MCS',
                    description:
                        `There is an error changing your password.`,
                    });
            }
            this.setState({isloading : false});
        }).catch(error => {
            notification['error']({
                message: 'MCS',
                description:
                    `There is an error changing your password.`,
                });
                this.setState({isloading : false});
        })
    }
    
    showResetPasswordPage = () => {
        return (
            <Spin spinning={this.state.isloading}>
            <form onSubmit={this.onSubmitExperience}>
                <div className="row">
                    <div className="col-md-12">
                        
                        <label>Old Password </label>    
                        <FormItem>
                            <Input
                                    className="form-control"
                                    prefix={<Icon type="lock"/>}
                                    name="email"
                                    value = {this.state.resetPassword.oldPassword}
                                    type="password"
                                    placeholder=" oldPassword"
                                    onChange={(e) => this.setState({resetPassword: {...this.state.resetPassword, oldPassword: e.target.value}})}
                                />
                        </FormItem>
                        
                        <label>New Password </label>
                        <FormItem>
                           <Input
                                    prefix={<Icon type="lock"/>}
                                    name="password"
                                    type="password"
                                    value = {this.state.resetPassword.newPassword}
                                    placeholder="NewPassword"
                                    onChange={(e) => this.setState({resetPassword : {...this.state.resetPassword, newPassword: e.target.value}})}
                                />
                        </FormItem> 
                        <label>Confirm New Password </label>
                        <FormItem>
                           <Input
                                    prefix={<Icon type="lock"/>}
                                    name="password"
                                    type="password"
                                    value = {this.state.resetPassword.newPassword2}
                                    onChange={(e) => this.setState({resetPassword : {...this.state.resetPassword, newPassword2: e.target.value}})}
                                    placeholder="NewPassword"
                                />
                        </FormItem> 
                    </div>
                </div>
                <FormItem>
                    <button onClick={this.resetPassword} className="btn btn-primary btn-flat m-b-30 m-t-30">Reset Password</button>
                </FormItem>                                        
            </form>
        </Spin>
        );
    }

    render = () => {
        const bodystyle =  {
        background: "#f1f2f7",
        display: "table",
        fontFamily: "'Open Sans' sans-serif !important",
        fontSize: "16px",
        width: "100%" }
        return (
            <div style={bodystyle}>
            <Navbar></Navbar>
            <div  class="right-panel ">
                <Header></Header>
                <BreadCrumb menu="Reports" submenu=" "></BreadCrumb>

                <div class="content mt-3">

                    <div class="animated fadeIn">
                        <div className="col-md-12">
                                <div className="row">
                                    {this.showResetPasswordPage()}    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingPage; 