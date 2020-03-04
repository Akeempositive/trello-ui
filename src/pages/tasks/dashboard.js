import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import {tasks} from './dashboard-datasource'
import {getTaskByUserId, createTask, searchTasksByFilter} from './dashboard-api'
import {hasAuthority} from  '../../utils/api-utils'
import {fetchAllUsers} from '../user/user-api'
import Moment from 'react-moment';
import moment from 'moment';
import {formatDate} from '../../utils/date-utils'
import {stateManager} from '../../utils/state-utils'
import {USER, CAN_UPDATE_TASK} from '../../constants'

import {
    Form,
    Input,
    DatePicker,
    DateRenderer,
    Tooltip,
    Icon,
    Modal,
    Select,
    Button,
    Row,
    Col,
    Spin,
    notification,Popconfirm,Table, Divider, Tag
  } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
class TasksPage extends Component  {
    constructor(props) {
        super(props);
        this.state={
            tasks:[],
            task : {},
            managers : [],
            user : {},
            taskSearchParameters : {
                name : '',
                context : 'ALL',
                startDate :'',
                completionDate : ''
            }
        }
        
    }

    componentDidMount(){
        this.getAllTask();
        this.getAllVisibleUsers();
        this.setState({user : JSON.parse(stateManager(USER))});
    }

    getAllVisibleUsers(){
        fetchAllUsers()
        .then(response=>{
            this.setState({managers:response.data})
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

    getUserAction = (record) =>{
        if(hasAuthority([CAN_UPDATE_TASK])){
            return (
                <span>
                    <Divider type="vertical" />
                    <button onClick={(e)=>{this.editTaskModal(record);}} type="button" class="btn btn-primary btn-sm">View User Task</button>
                </span>
            )
        }
    }
    getTableHeader = ()=>{

        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
                title: 'Context',
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
                        <span>{this.getUserAction(record)}</span>
                    )
              },
          ];

        return columns
    }

    createTaskPriviledge = () => {
        if(hasAuthority(['can_create_new_task'])){
            return (
                <span className="pull-right">
                    <a onClick={()=>{this.viewTaskModal()}}>Create New Task <Icon type="plus-circle" /></a>
                </span>
            );
        }
    }


    handleChange=(value)=>{
        console.log(`selected ${value}`);
    }

    getAllTask = () =>{
        this.setState({isloading:true})
        getTaskByUserId()
        .then(response=>{
                  notification['success']({
                       message: 'MCS',
                       description:'Get User Task Successfully',
                  });
                  this.setState({isloading:false, tasks: response.data})
             }).catch((error)=> {
                  this.setState({isloading:false})
                  notification['error']({
                  message: 'MCS',
                  description: `Error retrieving userTask.`,
               });
           });
    }

    createTask = () => {
        createTask(this.state.task)
        .then(response=>{
            notification['success']({
                 message: 'MCS',
                 description:'Task Created Successfully',
            });
            this.setState({isloading:false, viewTaskModal: false})
            this.getAllTask();
       }).catch((error)=> {
            this.setState({isloading:false})
            notification['error']({
            message: 'MCS',
            description: `Error Creating Task.`,
         });
     });
    }

    cancelCreateTaskModal = () => {
        this.setState({viewTaskModal:false})
    }

    searchTaskByParameters = () =>{
        searchTasksByFilter(this.state.taskSearchParameters)
        .then(response => {
            this.setState({tasks : response.data});
        }).catch(error => {

        })
    }

    viewTaskModal =()=>{
        this.setState({viewTaskModal:true, taskViewType: 'Create', task : {name : '', context : ''}})
    }

    editTaskModal = (record) => {
        this.setState({viewTaskModal : true, taskViewType : 'Update', task : record})
    }

    showManagerOption = () => {
        if(!this.state.user.role ) return;
        if(this.state.user.role.name.indexOf('HOD')> -1){
            this.state.task.hodName = this.state.user.userName;
            return (
                <FormItem
                >
                    <Select 
                        value={this.state.task.managerName} 
                        style={{ width: 120 }}
                        onChange = {(e)=>this.setState({task : {...this.state.task, managerName : e}})}
                        placeholder= "Select a Manager to assign task"
                    >
                    {this.allManagers()}
                    </Select>
                </FormItem>
            )
        }else {
            this.state.task.managerName = this.state.user.userName;
            this.state.task.hodName = "";
            return (
            <FormItem
            >
                <Select 
                    value={this.state.task.managerName} 
                    style={{ width: 120 }}
                    onChange = {(e)=>this.setState({task : {...this.state.task, managerName : e}})}
                    placeholder= "Select a Manager to assign task"
                >
                {this.allManagers()}
                </Select>
            </FormItem>)
        }
    }
    allManagers = () => {
        return (
            this.state.managers.map((item)=>
                <Option value={item.userName}>{item.userName}</Option>
            )
        );
    }

    searchByParametersForm = () => {
        return (
            <div className="col-md-12">
            <Form  layout="inline" className="signup-form">
                <FormItem>
                   <Input
                        size="large"
                        name="name"
                        autoComplete="off"
                        placeholder="Name"
                        value={this.state.taskSearchParameters.name}
                        onChange = {(e)=>{
                            this.state.taskSearchParameters.name = e.target.value;
                            //this.setState({taskSearchParameters : {...this.state.taskSearchParameters, name : e.target.value}});
                            this.searchTaskByParameters();
                        }}
                      />
                </FormItem>
                <FormItem
                   >
                    <Select value={this.state.taskSearchParameters.context} style={{ width: 120 }} 
                         onChange = {(e)=>{
                            this.state.taskSearchParameters.context = e;
                            this.searchTaskByParameters();
                        }}
                    >
                        <Option value="CREATED">CREATED</Option>
                        <Option value="ONGOING">ONGOING</Option>
                        <Option value="CANCELLED">CANCELLED</Option>
                        <Option value="DONE">DONE</Option>
                        <Option value="EXPIRED">EXPIRED</Option>
                        <Option value="ALL">ALL</Option>

                    </Select>
                </FormItem>
                <FormItem>
                    <DatePicker
                        placeholder= 'Choose a start date'
                        value={this.state.taskSearchParameters.dateOfStart}
                        onChange = {(e)=>{
                            this.state.taskSearchParameters.dateOfStart = e;
                            this.searchTaskByParameters();
                        }}
                        />
                </FormItem>
                <FormItem>
                    <DatePicker
                        placeholder= 'Choose an end date'
                        value={this.state.taskSearchParameters.dateOfComplite}
                        onChange = {(e)=>{
                            this.state.taskSearchParameters.dateOfComplite = e;
                            this.searchTaskByParameters();
                        }}/>
                </FormItem>
            </Form>
        </div>
        )
    }

    showTaskStatus = (task) => {
        if(task.id){
            return (
                <FormItem visible={this.state.task.id}
                >
                 <div><label>Task Status</label></div>
                 <Select value={this.state.task.state} style={{ width: 120 }} 
                      onChange = {(e)=>{
                         this.setState({task : {...this.state.task, state : e}})
                     }}
                 >
                     <Option value="CREATED">Created</Option>
                     <Option value="ONGOING">Ongoing</Option>
                     <Option value="CANCELLED">Cancelled</Option>
                     <Option value="DONE">Done</Option>
                     <Option value="EXPIRED">Expired</Option>

                 </Select>
             </FormItem>
            )
        }
    }
  render(){
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
                <BreadCrumb menu="Tasks" submenu=" "></BreadCrumb>

                <div class="content mt-3">

                    <div class="animated fadeIn">
                        <div className="row">
                            {this.searchByParametersForm()}

                        </div>
                        <Spin spinning={this.state.isloading}>

                            {/* Table for drugs */}
                            <div class="row">


                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title">Tasks</strong>
                                        {this.createTaskPriviledge()}
                                    </div>
                                    <div className="card-body">
                                        <Table columns={this.getTableHeader()} dataSource={this.state.tasks} />
                                    </div>

                                </div>
                            </div>

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
                                            <Form onSubmit={this.handleSubmit} className="signup-form">
                                            <FormItem
                                        // label="Name"
                                        // validateStatus={this.state.name.validateStatus}
                                        // help={this.state.name.errorMsg}
                                        >
                                        <label>Name</label>
                                        <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="Task Name name"
                                            value={this.state.task.name}
                                            onChange={(e) => this.setState({task : {...this.state.task, name: e.target.value}})}/>
                                    </FormItem>
                                    <label>context</label>
                                    <FormItem
                                
                                        >
                                        <Input
                                            size="large"
                                            name="amount"
                                            autoComplete="off"
                                            placeholder="Context"
                                            value={this.state.task.context}
                                            onChange={(e) => this.setState({task : {...this.state.task, context: e.target.value }})}/>
                                    </FormItem>
                                    <label>Completion Date </label>
                                    <FormItem
                                        >
                                        <DatePicker
                                            size="large"
                                            name="Target Date"
                                            autoComplete="off"
                                            placeholder="completion Date"
                                            value={moment(new Date(this.state.task.dateOfComplite), 'YYYY-MM-DD')}
                                            //value={<Moment parse="YYYY-MM-DD HH:mm">{new Date(this.state.task.dateOfComplite)}</Moment>}
                                            onChange={(e) => this.setState({task : {...this.state.task, dateOfComplite : e}})}/>
                                    </FormItem>
                                    <label>Manager Name </label>
                                    {this.showManagerOption()}

                                    {this.showTaskStatus(this.state.task)}

                                </Form>
                                        </div>

                            </Modal>
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

export default TasksPage;
