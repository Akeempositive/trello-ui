import React, { Component } from 'react';
import {login,storeToken} from '../login/login-api'
import { Redirect,Link } from 'react-router-dom';
import {
    Form,
    Input,
    // Tooltip,
    Icon,
    // Cascader,
    // Select,
    // Row,
    // Col,
    // Checkbox,
    // Button,
    Spin,
    notification
  } from 'antd';
  import jwtDecode from "jwt-decode";


const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm);
        return (
            <AntWrappedLoginForm />           
        );
    }
}

class LoginForm extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            redirectMe: {
                status:false,
                path:''
            },
            isloading:false
           }
        this.onSubmitExperience = this.onSubmitExperience.bind(this);

    }
    componentDidMount(){
        localStorage.clear()
    }

    onSubmitExperience = (e) => {
        e.preventDefault();
        this.setState({isloading:true})
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const logReq = {...values};
                console.log(logReq);
                login(values)
                .then(response=>{
                    console.log(Date.now())
                    storeToken(response.data)
                    notification['success']({
                        message: 'MCS',
                        description:
                          'Successfully Logged In.',
                      });
                    this.props.form.resetFields();
                    this.setState({isloading:false})
                    if(response.data.user.role.name = 'ADMIN'){
                        this.setRoute('users');
                    }else {
                        this.setRoute('tasks')
                    }
                }).
                catch((error)=> {
                    if(error.response){
                      console.log(error.response);
                      if(error.response.status==400 && error.response.data.error=="invalid_grant" && error.response.data.error_description=="User account is locked"){
                        this.setState({isloading:false})
                        notification['error']({
                            message: 'MCS',
                            description:
                              `This Account Has been Blocked, Contact Administrator.`,
                          });
                      }
                      else if(error.response.status == 400 ){
                        
                        this.setState({isloading:false})
                        notification['error']({
                            message: 'MCS',
                            description:
                              `Username / Password  is Incorrect.`,
                          });
                        
                            console.log(error.response.status);
                      }else{
                        
                        this.setState({isloading:false})
                        notification['error']({
                            message: 'MCS',
                            description:
                              `An Error occured Contact Administrator.`,
                          });
                          
                        console.log(error.response.status);
                      }
                    }else{
                        this.setState({isloading:false})
                        notification['error']({
                            message: 'MCS',
                            description:
                              `An Error occured Contact Administrator.`,
                          });  
                          
                    }
                    
                });
        
            }else{
                this.setState({isloading:false})

            }

            // this.setState({isloading:false})

        });
    }
    setRoute=(path)=>{
        this.setState({redirectMe: {
                status:true,
                path:`/${path}`
            }
        })
    }

  render() {
    if(this.state.redirectMe.status){
        console.log("Reiercting");
        return <Redirect to={this.state.redirectMe.path} />
    }
    const {getFieldDecorator} = this.props.form;

    return (
        <div className="bg-dark" 
        style={{height: "100vh", display: "flex", alignItems: "center",justifyContent: "center"}}>
            <div className="bg-dark sufee-login d-flex align-content-center flex-wrap" style={{height:"100%", width:"100%"}}>
                <div className="container">
                    <div className="login-content">
                        <div className="login-logo">
                            <h2>MCS</h2>
                        </div>
                        <div className="login-form">
                            <Spin spinning={this.state.isloading}>
                                <form onSubmit={this.onSubmitExperience}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <FormItem>
                                                {getFieldDecorator('email', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'Please input your email!'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className="form-control"
                                                        prefix={<Icon type="user"/>}
                                                        name="email"
                                                        type="text"
                                                        placeholder=" Email"
                                                    />
                                                )}
                                            </FormItem>
                                        </div>
                                    </div>
                                    

                                    <div className="row">
                                        <div className="col-md-12">
                                            <FormItem>
                                                {getFieldDecorator('password', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'Please input your Password!'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        prefix={<Icon type="lock"/>}
                                                        name="password"
                                                        type="password"
                                                        placeholder="Password"
                                                    />

                                                )}
                                            </FormItem> 
                                        </div>
                                    </div>
                                    
                                    <FormItem>
                                        <button type="submit" className="btn btn-primary btn-flat m-b-30 m-t-30">Login</button>
                                    </FormItem>                                        
                                    <div className="register-link m-t-15 text-center">
                                        <p>Don't have account ? <Link to={`/sign-up`} >Sign up</Link></p>
                                    </div>
                                </form>
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Login;