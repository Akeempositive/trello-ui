
import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'

import Moment from 'react-moment';
import moment from 'moment';
import {createTask} from '../tasks/dashboard-api'
import {fetchAllUsers,unBlockUser,blockUser, saveUser, getAllDepartments, getTaskByUserId, searchByFilter} from './user-api'
import {hasAuthority} from  '../../utils/api-utils'
import {CAN_CREATE_USER, CAN_UPDATE_USER, CAN_VIEW_USER, CAN_UPDATE_TASK} from '../../constants'

import {
    Form,
    Input,
    Tooltip,
    Icon,
    Button,
    Cascader,
    Select,
    Row,
    Modal,
    DatePicker,
    Spin,
    notification,Popconfirm,Table, Divider, Tag
  } from 'antd';
import { resetPassword } from '../settings/settings-api';

const FormItem = Form.Item;
const Label = Form.Label;
const { Option } = Select;
class UserPage extends Component  {
    constructor(props) {
        super(props);
        this.state={
            users:[],
            isloading:true,
            viewUserType: '',
            userTableVisible : true,
            viewTaskModal: false,
            userTaskVisible : false,
            taskViewType: '',
            task : {},
            userSearchParameters : {},
            userModalVisible: false,
            departments : [{value : 'IT', label : 'IT', lastName : 'Suara'}],
            user : {role: 'ADMIN', managerName : ''},
            userIdInView: '',
            userNameInView : ''
        }
            // this.onsubmitDrug = this.onsubmitDrug.bind(this);
            this.unblockUzer = this.unblockUzer.bind(this);

    }

    searchByParametersForm = () => {
        return (
            <div className="col-md-12">
            <Form  layout="inline" className="signup-form">
                <FormItem>
                    <Input
                        size="large"
                        autoComplete="off"
                        placeholder="Seach By"
                        value={this.state.userSearchParameters.userName}
                        onChange = {(e)=>{
                            this.state.userSearchParameters.userName = e.target.value;
                            this.searchUsersByParameters();
                        }}
                       />
                </FormItem>
            </Form>
        </div>
        )
    }

    componentDidMount(){
        this.getAllUsers()
        this.getAllDepartments()
    }

    getAllDepartments = () => {
        getAllDepartments()
        .then((response)=> {
            this.setState({departments : response.data});
        }).catch((error) =>{
            console.log('An error occured while getting all departments');
        });
    }

    getAccontLockedInfo = (block)=>{
        let badge = {clazz:"badge badge-info", display:"Active"}
        if(block==1){
            badge = {clazz:"badge badge-danger", display:"Blocked"}
        }
        return (
            <span className={badge.clazz}>
                {badge.display}
            </span>
        );
    }

    editUserModal = (user) =>{
        this.setState({userModalVisible: true, user : {...user, role : user.role.name}, viewUserType : 'Update'});
    }

    getUserTaskAction = (record) =>{
        if(hasAuthority([CAN_UPDATE_TASK])){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{this.editTaskModal(record);}} type="button" class="btn btn-primary btn-sm">View User Task</button>
                </span>
            )
        }
    }

    getUserAction = (record) =>{
        if(hasAuthority(['can_view_user_task'])){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{this.props.history.push(`/tasks/${record.id}`);}} type="button" class="btn btn-primary btn-sm">View User Task</button>
                </span>
            )
        }

        if(hasAuthority(['can_update_user_info'])){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{ this.editUserModal(record)}} type="button" class="btn btn-primary btn-sm">Edit User</button>
               </span>
            )
        }

        if(hasAuthority([CAN_UPDATE_TASK]) && record.submittedWeeklyReport){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{ this.showWeeklyReport(record.id, record.userName)}} type="button" class="btn btn-primary btn-sm">View Weekly Report</button>
               </span>
            )
        }
    }

    getTaskStatus = (status)=>{
        let badge ={}
        if(status=="COMPLETED"){
            badge = {clazz:"badge badge-success", display:"COMPLETED"}
        }
        else if(status=="PENDING"){
            badge = {clazz:"badge badge-info", display:"PENDING"}
        }
        else if(status=="STARTED"){
            badge = {clazz:"badge badge-primary", display:"STARTED"}
        }
        else if(status=="CANCELLED"){
            badge = {clazz:"badge badge-danger", display:"CANCELLED"}
        } else if(status=="CREATED"){
            badge = {clazz:"badge badge-primary", display:"CREATED"}
        }
        return (
            <span className={badge.clazz}>
                {badge.display}
            </span>
        );
    }


    showWeeklyReport = (userId, userName) => {
        this.state = {...this.state, userIdInView : userId, userNameInView : userName};
        getTaskByUserId(userId)
        .then(response => {
            this.setState({userTableVisible: false,userTaskVisible : true, userTasks : response.data});
        }).catch(error=> {

        })
    }

    unblockUzer = (email) =>{
        unBlockUser(email)
        .then(response=>{
            console.log("Users Response");
            console.log(response.data)
            this.getAllUsers()
            // this.setState({isloading:false})
        })
        .catch((error)=> {
            console.log("User Error Response");

            notification['error']({
            message: 'MCS',
            description:
                `An Error Occured UnBlocking User Users .`,
            });

            this.setState({isloading:false})
            console.log(error);

        });
    }

    blockUzer = (email) =>{
        blockUser(email)
        .then(response=>{
            console.log("Users Response");
            console.log(response.data)
            this.getAllUsers()
            // this.setState({isloading:false})
        })
        .catch((error)=> {
            console.log("User Error Response");

            notification['error']({
            message: 'MCS',
            description:
                `An Error Occured Blocking User Users .`,
            });

            this.setState({isloading:false})
            console.log(error);

        });
    }

    editTaskModal = (record) => {
        this.setState({viewTaskModal : true, taskViewType : 'Update', task : record})
    }

    getTableHeaderTask = ()=>{
        
                const columns = [
                    {
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                    },
                    {
                        title: 'Description',
                        dataIndex: 'context',
                        key: 'context',
                    },
                    {
                        title: 'CurrentStatus',
                        dataIndex: 'state',
                        key: 'state',
                        render: state => (
                            <span>
                                {this.getTaskStatus(state)}
                            </span>
                          ),
                    },
                    {
                        title: 'Date completed',
                        dataIndex: 'dateOfComplite',
                        key: 'dateOfComplite',
                        render : dateOfComplite => (
                            <Moment parse="YYYY-MM-DD HH:mm">{new Date(dateOfComplite)}</Moment>
                         
                        )
                    },
                    {
                        title: 'Action',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text,record) =>
                            (
                                <span>{this.getUserTaskAction(record)}</span>
                            )
                      },
                  ];
        
                return columns
            }

    getTableHeaderUser = ()=>{

        const columns = [
            {
                title: 'Username',
                dataIndex: 'userName',
                key: 'userName',
            },
            {
              title: 'First Name',
              dataIndex: 'firstName',
              key: 'firstName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Department',
              dataIndex: 'department',
              key: 'department',
            },
            {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                render: role => (
                     <span className="badge badge-secondary">
                        {role.name}
                     </span>
                ),
            },{
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                render: (text,record) =>
                    (
                        <span>{this.getUserAction(record)}</span>
                    )
              },
          ];

          return columns
    }

    createUserModal = () =>{
        this.setState(
            {
                viewUserType: 'Create', 
                user : {
                    userName : '', 
                    lastName : '', 
                    role : 'ADMIN', 
                    firstName : '',
                    lastName : '',
                    managerUsername : '',
                    birthDay: new Date(),
                    chiefUserName : ''
                },
                userModalVisible: true
            })
    }

    getAllUsers = () =>{
        this.setState({isloading:true})
        fetchAllUsers()
        .then(response=>{
            this.setState({users:response.data})
            this.setState({isloading:false})
        })
        .catch((error)=> {
            console.log("User Error Response");

            notification['error']({
            message: 'MCS',
            description:
                `An Error Fetching Users .`,
            });

            this.setState({isloading:false})
            console.log(error);

        });
    }

    searchUsersByParameters = () => {
        searchByFilter(this.state.userSearchParameters)
        .then (response => {
            this.setState({users : response.data});
        }).catch(error =>{

        });

    }

    updateUser = () => {
        saveUser(this.state.user)
        .then(response=>{
            this.getAllUsers();
            this.setState({isloading:false, userModalVisible: false})
        })
        .catch((error)=> {
            console.log("User Error Response");

            notification['error']({
            message: 'MCS',
            description:
                `An Error Fetching Users .`,
            });

            this.setState({isloading:false})
            console.log(error);

        });
    }
    allManagers = () => {
        return (
            this.state.departments.map((item)=>
                <Option value={item.value}>{item.value}</Option>
            )
        );
    }

    cancelUserTaskModal = () => {
        this.setState({userModalVisible: false, user : {}})
    }

    createUserPreviledge = () => {
        if(hasAuthority([CAN_CREATE_USER])){
            return (
                <span className="pull-right">
                    <a onClick={()=>{this.createUserModal()}}>Onboard New User <Icon type="plus-circle" /></a>
                </span>
            );
        }
    }

    showManagerOption = () => {
        if(!this.state.user.role ) return;
        if(this.state.user.role.indexOf('Manager')> -1){
            return (
                <FormItem
                >
                    <Select 
                        value={this.state.user.department} 
                        style={{ width: 120 }}
                        onChange = {(e)=>this.setState({user : {...this.state.user, department : e}})}
                        placeholder= "Select a Department"
                    >
                    {this.allManagers()}
                    </Select>
                </FormItem>
            )
        }else if(this.state.user.role.indexOf('HOD') > -1){
            return (
                <FormItem
                >
                <Input
                    size="large"
                    name="name"
                    autoComplete="off"
                    placeholder="Department"
                    value={this.state.user.department}
                    onChange = {(e)=>this.setState({user : {...this.state.user, department : e.target.value}})}
                   />
            </FormItem>
            )
        }
    }

    showUserTable = () => {
        this.setState({userTableVisible: true, userTaskVisible: false});
    }
    showAppropriateTable = () =>{
        if(this.state.userTableVisible)
        {
            return (
            <div className="card">
            {this.searchByParametersForm()}
            <div className="card-header">
                <strong className="card-title">Users</strong>
                {this.createUserPreviledge()}
            </div>
            <div className="card-body">
                <Table columns={this.getTableHeaderUser()} dataSource={this.state.users} />
            </div>

        </div>
        )
        } else if(this.state.userTaskVisible){
            return (
                <div className="card">
                <div className="card-header">
                    <strong className="card-title">Tasks</strong>
                    <button onClick={this.showUserTable}>Users</button>
                </div>
                <div className="card-body">
                    <Table columns={this.getTableHeaderTask()} dataSource={this.state.userTasks} />
                </div>

            </div>
            )
        }
    }

    showEditTaskModal = () => {
        return (
            <div className="col-md-12">
            <Modal
                title={this.state.taskViewType + ' Task'}
                visible={this.state.viewTaskModal}
                onOk={this.createTask}
                // okButtonProps={{ disabled: this.isFormInvalid() }}
                onCancel={this.cancelCreateTaskModal}
                okText={this.state.taskViewType}
                >
                    <div className="row">
                        <Form className="signup-form">
                        <label>Task Name</label>
                        <FormItem
                    >
                    <Input
                        size="large"
                        name="name"
                        autoComplete="off"
                        placeholder="Task Name name"
                        value={this.state.task.name}
                        onChange={(e) => this.setState({task : {...this.state.task, name: e.target.value}})}/>
                </FormItem>

                <FormItem
            
                    >
                    <label>Task Description</label>
                    <Input
                        size="large"
                        name="amount"
                        autoComplete="off"
                        placeholder="Context"
                        value={this.state.task.context}
                        onChange={(e) => this.setState({task : {...this.state.task, context: e.target.value }})}/>
                </FormItem>
                <FormItem
                    >
                    <label>Completion Date</label>
                    <DatePicker
                        size="large"
                        name="Target Date"
                        autoComplete="off"
                        placeholder="completion Date"
                        value={moment(new Date(this.state.task.dateOfComplite), 'YYYY-MM-DD')}
                        onChange={(e) => this.setState({task : {...this.state.task, dateOfComplite : e}})}/>
                </FormItem>
                <label>Mannager Name</label>
                {this.showManagerOption()}
            </Form>
                    </div>

        </Modal> 
        </div>
        )
    }
    handleUserChange = (e) => {
        console.log('Working yet?')
        this.setState({user : {...this.state.user, key : e.target.value}})
        console.log(this.state.user.userName)
    }

    cancelCreateTaskModal = () => {
        this.setState({viewTaskModal:false})
    }

    createTask = () => {
        createTask(this.state.task)
        .then(response=>{
            notification['success']({
                 message: 'MCS',
                 description:'Task Created Successfully',
            });
            this.setState({isloading:false, viewTaskModal: false})
            this.showWeeklyReport(this.state.userIdInView, this.state.userNameInView)
       }).catch((error)=> {
            this.setState({isloading:false})
            notification['error']({
            message: 'MCS',
            description: `Error Creating Task.`,
         });
     });
    }

  render() {
    const bodystyle =  {
        background: "#f1f2f7",
        display: "table",
        fontFamily: "'Open Sans' sans-serif !important",
        fontSize: "16px",
        width: "100%" }

    return (
        <div style={bodystyle}>
        {/* <!-- Left Panel --> */}

            <Navbar></Navbar>
            {/* <!-- /#left-panel --> */}
            {/* <!-- Left Panel --> */}

            {/* <!-- Right Panel --> */}

            <div  class="right-panel ">
                <Header></Header>
                {/* <!-- /header --> */}
                {/* <!-- Header--> */}

                <BreadCrumb menu="User" submenu=" "></BreadCrumb>

                <div class="content mt-3">

                    <div class="animated fadeIn">
                        <Spin spinning={this.state.isloading}>

                            {/* Table for drugs */}
                            <div class="row">

                            <div className="col-md-12">
                                {this.showAppropriateTable()}
                            </div>

                            <div className="col-md-12">
                                <Modal
                                    title= {this.state.viewUserType + ' User'}
                                    visible={this.state.userModalVisible}
                                    onOk={this.updateUser}
                                    // okButtonProps={{ disabled: this.isFormInvalid() }}
                                    onCancel={this.cancelUserTaskModal}
                                    okText={this.state.viewUserType}
                                    >
                                        <div className="row">
                                            <Form  className="signup-form">
                                            <label>Username</label>
                                            <FormItem
                                        >
                                        <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="username"
                                            type= "text"
                                            value={this.state.user.userName}
                                            onChange = {(e)=>this.setState({user : {...this.state.user, userName : e.target.value}})}
                                            />
                                    </FormItem>

                                    <label>Firstname</label>
                                    <FormItem
                                        >
                                        <Input
                                            size="large"
                                            name="firstname"
                                            autoComplete="off"
                                            placeholder="Firstname"
                                            value={this.state.user.firstName}
                                            onChange = {(e)=>this.setState({user : {...this.state.user, firstName : e.target.value}})}
                                            />
                                    </FormItem>
                                    <label>Lastname</label>
                                    <FormItem
                                        >
                                        <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="Lastname"
                                            value={this.state.user.lastName}
                                            onChange = {(e)=>this.setState({user : {...this.state.user, lastName : e.target.value}})}
                                           />
                                    </FormItem>

                                    <label>Email</label>
                                    <FormItem
                                       >
                                
                                        <Input
                                            size="large"
                                            name="email"
                                            autoComplete="off"
                                            placeholder="Email"
                                            onChange = {(e)=>this.setState({user : {...this.state.user, email : e.target.value}})}
                                            value={this.state.user.email}
                                           />
                                    </FormItem>
                                    <label>Role</label>
                                    <FormItem
                                        >

                                        <Select value= {this.state.user.role} style={{ width: 120 }} 
                                        onChange = {(e)=>this.setState({user : {...this.state.user, role : e}})}>
                                        <Option value="ADMIN">Admin</Option>
                                            <Option value="HOC">HOC</Option>
                                            <Option value="HOD">HOD</Option>
                                            <Option value="Manager">Manager</Option>
                                        </Select>
                                        {/* <Label>Manager Name</Label> */}
                                    </FormItem>
                                        
                                        {this.showManagerOption()}
                                        <label>Birthday</label>
                                        <FormItem
                                        >
                                            <DatePicker
                                            size="large"
                                            name="Target Date"
                                            autoComplete="off"
                                            placeholder="Date of Birth"
                                            value={moment(new Date(this.state.user.birthDay), 'YYYY-MM-DD')}
                                            onChange ={ (e)=> {this.setState({user : {...this.state.user, birthDay : e}})}}
                                           />
                                        </FormItem>
                                            </Form>
                                        </div>
                                    </Modal>
                                </div>
                            </div>

                            {this.showEditTaskModal()}
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default UserPage;
