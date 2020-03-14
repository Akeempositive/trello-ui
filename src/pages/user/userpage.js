
import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import {formatDate} from '../../utils/date-utils'
import Moment from 'react-moment';
import moment from 'moment';
import {createTask} from '../tasks/dashboard-api'
import {getReportsForUser, updateComment} from '../weekly-report/index-api'
import {fetchAllUsers,unBlockUser,blockUser, saveUser, getAllDepartments, getTaskByUserId, searchByFilter} from './user-api'
import {hasAuthority} from  '../../utils/api-utils'
import {CAN_CREATE_USER, CAN_UPDATE_USER, CAN_VIEW_USER, CAN_UPDATE_TASK, USER} from '../../constants'
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
import { stateManager } from '../../utils/state-utils';

const FormItem = Form.Item;
const {TextArea} = Input;
const Label = Form.Label;
const { Option } = Select;

class UserPage extends Component  {
    
    constructor(props) {
        super(props);
        this.state={
            users:[],
            isloading:true,
            reportModalVisible: false,
            userReports : [],
            report : {},
            viewUserType: '',
            userTableVisible : true,
            viewTaskModal: false,
            userTaskVisible : false,
            taskViewType: '',
            task : {},
            userSearchParameters : {},
            userModalVisible: false,
            departments : [{value : 'IT', label : 'IT', lastName : 'Suara'}],
            loggedInUser : {},
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
        this.state.loggedInUser = JSON.parse(stateManager(USER));
        this.getAllUsers();
        this.getAllDepartments();
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
                    <button onClick={(e)=>{this.editTaskModal(record);}} type="button" class="btn btn-primary btn-sm">View Task</button>
                </span>
            )
        }
    }

    getUserReportAction = (record) =>{
        if(hasAuthority([CAN_UPDATE_TASK])) {
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{this.updateReportModal(record);}} type="button" class="btn btn-primary btn-sm">View Report</button>
                </span>
            )
        }
    }

    updateReportModal =(record) =>{
        this.setState({reportModalVisible : true, report : record});
    }

    viewSubmittedReport = (record) => {
        if(hasAuthority([CAN_UPDATE_TASK]) && record.submittedWeeklyReport && (this.state.loggedInUser.role.name === 'HOD' || this.state.loggedInUser.role.name === 'HOC')){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{ this.showWeeklyReport(record.userName)}} type="button" class="btn btn-primary btn-sm">View Weekly Reports</button>
                </span>
            )
        }
    }

    viewEditUser = (record) => {
        if(hasAuthority([CAN_UPDATE_USER])){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{ this.editUserModal(record)}} type="button" class="btn btn-primary btn-sm">Edit User</button>
                </span>
            )
        }
    }

    viewCanUpdteTask = (record) => {
        if(hasAuthority([CAN_UPDATE_TASK])){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{ this.showUserTask(record.id, record.userName)}} type="button" class="btn btn-primary btn-sm">View User Tasks</button>
                </span>
            )
        }
    }

    getUserAction = (record) =>{
        if(hasAuthority([CAN_UPDATE_TASK])){
            {this.viewCanUpdteTask()}
        }

        if(hasAuthority([CAN_UPDATE_USER])){
            {this.viewEditUser()}
        }

        if(hasAuthority([CAN_UPDATE_TASK]) && record.submittedWeeklyReport){
            {this.viewSubmittedReport()}
        }
    }

    getTaskStatus = (status)=>{
        let badge ={}

        if(status=="CREATED"){
            badge = {clazz:"badge badge-info", display:"Created"}
        } else if(status=="ONGOING"){
            badge = {clazz:"badge badge-primary", display:"Ongoing"}
        } else if(status=="CANCELLED"){
            badge = {clazz:"badge badge-danger", display:"Cancelled"}
        } else if(status=="DONE"){
            badge = {clazz:"badge badge-success", display:"Done"}
        }else if(status == 'EXPIRED'){
            badge = {clazz:"badge badge-danger", display:"Expired"}
        }
        return (
            <span className={badge.clazz}>
                {badge.display}
            </span>
        );
    }

    showUserTask = (userId, userName) => {
        getTaskByUserId(userId)
        .then(response => {
            this.setState({userIdInView : userId, userNameInView : userName, userReportVisible: false, userTableVisible: false,userTaskVisible : true, userTasks : response.data});
        }).catch(error=> {

        })
    }

    showWeeklyReport = ( userName) => {
        this.state = {...this.state, userNameInView : userName};
        getReportsForUser(userName)
        .then(response => {
            this.setState({userReportVisible: true, userTableVisible: false,userTaskVisible : false, userReports : response.data});
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
                            <span>
                                {formatDate(dateOfComplite)}
                            </span>
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
                        <span>
                            {this.viewCanUpdteTask(record)}
                            {this.viewSubmittedReport(record)}
                            {this.viewEditUser(record)}
                        </span>
                    )
              },
          ];

          return columns
    }
    
    getTableHeaderReport = ()=>{
        
                const columns = [
                    {
                        title: 'Manager Name',
                        dataIndex: 'managerName',
                        key: 'managerName',
                    },
                    {
                        title: 'Current Status',
                        dataIndex: 'state',
                        key: 'state',
                        render: state => (
                            <span>
                                {this.getTaskStatus(state)}
                            </span>
                          ),
                    },
                    {
                        title: 'Due Date',
                        dataIndex: 'dueDate',
                        key: 'dueDate',
                        render : dueDate => (
                            <Moment parse="YYYY-MM-DD HH:mm">{new Date(dueDate)}</Moment>
                         
                        )
                    },{
                        title: 'Action',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text,record) =>
                            (
                                <span>{this.getUserReportAction(record)}</span>
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
            response = response.data;
            if(response.successful){
                this.getAllUsers();
                this.getAllDepartments();
                this.setState({isloading:false, userModalVisible: false})
            }else {
                notification['error']({
                    message: 'MCS',
                    description:
                        `An Error Creating/Updating User .` + response.message,
                    });
        
            }
        })
        .catch((error)=> {
            console.log("User Error Response");

            notification['error']({
            message: 'MCS',
            description:
                `An Error Creating/Updating User .`,
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

    showManagerOptionInUserCreation = () => {
        if(!this.state.user.role ) return;
        if(this.state.user.role.indexOf('Manager')> -1){
            return (
                <FormItem
                >
                <div><label>Department Name </label></div>
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
                <label>Department Name </label>
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

    allManagersInTask = () => {
        return (
            this.state.users.map((item)=>
                <Option value={item.userName}>{item.userName}</Option>
            )
        );
    }

    showManagerOptionInTaskCreation = () => {
            return (
                
                <FormItem
                >
                <div><label>Manager Name </label></div>
                    <Select 
                        value={this.state.task.managerName} 
                        style={{ width: 120 }}
                        onChange = {(e)=>this.setState({task : {...this.state.task, managerName : e}})}
                        placeholder= "Select a Manager"
                    >
                    {this.allManagersInTask()}
                    </Select>
                </FormItem>
            )
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
            {this.showEditUserModal()}

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

                {this.showEditTaskModal()}
            </div>
            )
        } else if(this.state.userReportVisible){
            return (
                <div className="card">
                <div className="card-header">
                    <strong className="card-title">Tasks</strong>
                    <button onClick={this.showUserTable}>Users</button>
                </div>
                <div className="card-body">
                    <Table columns={this.getTableHeaderReport()} dataSource={this.state.userReports} />
                </div>

                {this.showUpdateReportModal()}
            </div>
            )
        }
    }

    showEditUserModal = () => {
        return (
            <div className="col-md-12">
            <Modal
                title= {this.state.viewUserType + ' User'}
                visible={this.state.userModalVisible}
                onOk={(e)=>this.updateUser()}
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
                    
                    {this.showManagerOptionInUserCreation()}
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
        );
    }
    
    showEditTaskModal = () => {
        return (
            <div className="col-md-12">
            <Modal
                title={this.state.taskViewType + ' Task'}
                visible={this.state.viewTaskModal}
                onOk={this.createTask}
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
                        placeholder="Name of Task"
                        value={this.state.task.name}
                        onChange={(e) => this.setState({task : {...this.state.task, name: e.target.value}})}/>
                </FormItem>

                <FormItem
            
                    >
                    <label>Task Description</label>
                    <Input
                        size="large"
                        name="context"
                        autoComplete="off"
                        placeholder="Context"
                        value={this.state.task.context}
                        onChange={(e) => this.setState({task : {...this.state.task, context: e.target.value }})}/>
                </FormItem>
                <FormItem
                    >
                    <div><label>Completion Date</label></div>
                    <DatePicker
                        size="large"
                        name="Target Date"
                        autoComplete="off"
                        placeholder="completion Date"
                        value={moment(new Date(this.state.task.dateOfComplite), 'YYYY-MM-DD')}
                        onChange={(e) => this.setState({task : {...this.state.task, dateOfComplite : e}})}/>
                </FormItem>
                {this.showManagerOptionInTaskCreation()}
                <FormItem>
                    <div><label>Task Status</label></div>
                    <Select value={this.state.task.state} style={{ width: 120 }} 
                         onChange = {(e)=>
                            this.setState({task : {...this.state.task, state : e}})
                        }
                    >
                        <Option value="CREATED">Created</Option>
                        <Option value="ONGOING">Ongoing</Option>
                        <Option value="CANCELLED">Cancelled</Option>
                        <Option value="DONE">Done</Option>
                        <Option value="EXPIRED">Expired</Option>

                    </Select>
                </FormItem>
            </Form>
                    </div>

        </Modal> 
        </div>
        )
    }

    showReportFilling = () => {
            return (
                <Form  className="signup-form"
                >
                <label>Report Due Date  </label>
            
                <Moment parse="YYYY-MM-DD">{new Date(this.state.report.dueDate)}</Moment>
                <FormItem
            >
            <label>Report Content</label>
                    <TextArea 
                        size="large"
                        name="amount"
                        disabled = {this.state.loggedInUser.userName !== this.state.report.managerName}
                        size = {{rows: 10, cols : 25}}
                        //autoSize ={{minRows:3, maxRows : 12}}
                        autoComplete="off"
                        placeholder="Context"
                        value={this.state.report.reportContent}
                        onChange={(e) => this.setState({report : {...this.state.report, reportContent: e.target.value }})}/>
                </FormItem>
                <FormItem
            >
            <label>HOD Comment</label>
                    <TextArea 
                        size="large"
                        name="amount"
                        disabled={this.state.loggedInUser.role.name !== 'HOD'}
                        autoSize ={{minRows:3, maxRows : 12}}
                        autoComplete="off"
                        placeholder="HOD Comment"
                        value={this.state.report.hodComment}
                        onChange={(e) => this.setState({report : {...this.state.report, hodComment: e.target.value }})}
                        />
                </FormItem>
                <FormItem
            >
            <label>HOC Comment</label>
                    <TextArea 
                        size="large"
                        disabled = {this.state.loggedInUser.role.name !== 'HOC'}
                        name="amount"
                        autoSize ={{minRows:3, maxRows : 12}}
                        autoComplete="off"
                        placeholder="HOC Comment"
                        value={this.state.report.hocComment}
                        onChange={(e) => this.setState({report : {...this.state.report, hocComment: e.target.value }})}
                        />
                </FormItem>
                <FormItem
           >

            <label>Report Status</label>
            <Select value={this.state.report.state} style={{ width: 120 }} 
                onChange = {(e)=>this.setState({report : {...this.state.report, state : e}})}
            >
                <Option value="CREATED">Created</Option>
                <Option value="ONGOING">Ongoing</Option>
                <Option value="CANCELLED">Cancelled</Option>
                <Option value="DONE">Done</Option>
                <Option value="EXPIRED">Expired</Option>
            </Select>
        </FormItem>
            </Form>
        )
    }

    showUpdateReportModal = () => {
        return (
            <div className="col-md-12">
            <Modal
                title={'Report'}
                visible={this.state.reportModalVisible}
                onOk={this.submitReport}
                onCancel={this.cancelReportModal}
                okText={this.state.taskViewType}
                >
                    <div className="row">
                        {this.showReportFilling()}
                    </div>
                </Modal>
            </div>
        )
    }
    
    submitReport = () => {
        updateComment(this.state.report, this.state.loggedInUser.role.name)
        .then (response =>{
            notification['success']({
                message: 'MCS',
                description:
                    `Successfully submitted report.`,
                });
                this.showWeeklyReport(this.state.report.managerName);
                this.setState({reportModalVisible : false})
        }).catch(error => {

        })
    }

    cancelCreateTaskModal = () => {
        this.setState({viewTaskModal:false})
    }

    cancelReportModal = () => {
        this.setState({reportModalVisible : false})
    }
    
    createTask = () => {
        createTask(this.state.task)
        .then(response=>{
            notification['success']({
                 message: 'MCS',
                 description:'Task Updated Successfully',
            });
            this.setState({isloading:false, viewTaskModal: false})
            console.log(this.state.userIdInView + this.state.userNameInView)
            this.showUserTask(this.state.userIdInView, this.state.userNameInView)
       }).catch((error)=> {
            this.setState({isloading:false})
            notification['error']({
            message: 'MCS',
            description: `Error Updating Task.`,
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
                            </div>
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    );
  }

}

export default UserPage;
