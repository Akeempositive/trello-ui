import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import {tasks} from './dashboard-datasource'
import {getTaskByUserId, createTask} from './dashboard-api'
import {hasAuthority} from  '../../utils/api-utils'
import {fetchAllUsers} from '../user/user-api'
import {Moment} from 'moment'
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
            searchParameters : {
                name : '',
                description : '',
                state : 'ALL',
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
        if(status=="DONE"){
            badge = {clazz:"badge badge-success", display:"DONE"}
        }
        else if(status=="PENDING"){
            badge = {clazz:"badge badge-info", display:"PENDING"}
        }
        else if(status=="CREATED"){
            badge = {clazz:"badge badge-primary", display:"CREATED"}
        }
        else if(status=="CANCELLED"){
            badge = {clazz:"badge badge-danger", display:"CANCELLED"}
        } else if(status == 'STARTED'){
            badge = {clazz:"badge badge-primary", display:"STARTED"}
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

    searchTaskByParameters = (e) =>{
        e.preventDefault();
        console.log('I m searching by parameter');
    }

    viewTaskModal =()=>{
        this.setState({viewTaskModal:true, taskViewType: 'Create'})
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
        }
    }
    allManagers = () => {
        return (
            this.state.managers.map((item)=>
                <Option value={item.userName}>{item.userName}</Option>
            )
        );
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
                            <div className="col-md-12">
                                <Form  layout="inline" onSubmit={this.searchTaskByParameters} className="signup-form">
                                    <FormItem>
                                       <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="Name"
                                            value={this.state.searchParameters.name}
                                            onChange = {(e)=>this.setState({searchParameters : {...this.state.searchParameters, name : e.target.value}})}
                                            
                                          />
                                    </FormItem>

                                    <FormItem>
                                        <Input
                                            size="large"
                                            autoComplete="off"
                                            placeholder="Description"
                                            value={this.state.searchParameters.description}
                                            onChange = {(e)=>this.setState({searchParameters : {...this.state.searchParameters, description : e.target.value}})}
                
                                           />
                                    </FormItem>

                                    <FormItem
                                       >
                                        <Select firstActiveValue="DONE" style={{ width: 120 }} 
                                            onChange = {(e)=>this.setState({searchParameters : {...this.state.searchParameters, state : e}})}
                                        >
                                            <Option value="DONE">Completed</Option>
                                            <Option value="PENDING">Pending</Option>
                                            <Option value="STARTED">Started</Option>
                                            <Option value="CANCELLED">Cancelled</Option>
                                            <Option value="ALL">All</Option>

                                        </Select>
                                    </FormItem>
                                    <FormItem>
                                        <DatePicker
                                            placeholder= 'Choose a start date'
                                            value={this.state.searchParameters.startDate}
                                            onChange = {(e)=>this.setState({searchParameters : {...this.state.searchParameters, startDate : e}})}
                                            />
                                    </FormItem>
                                    <FormItem>
                                        <DatePicker
                                            placeholder= 'Choose an end date'
                                            value={this.state.searchParameters.completionDate}
                                            onChange = {(e)=>this.setState({searchParameters : {...this.state.searchParameters, completionDate : e}})}
                                            />
                                    </FormItem>
                                    {this.showManagerOption()}
                                    <FormItem>
                                      <Button type="primary" icon="search">
                                            Search
                                      </Button>
                                    </FormItem>

                                </Form>
                            </div>

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
                                        <DatePicker
                                            size="large"
                                            name="Target Date"
                                            autoComplete="off"
                                            placeholder="completion Date"
                                            value={this.state.task.dateOfComplite}
                                            onChange={(e) => this.setState({task : {...this.state.task, dateOfComplite : e}})}/>
                                    </FormItem>

                                    {this.showManagerOption()}
                                </Form>
                                        </div>

                            </Modal>
                            </div>


                        </div>

                        </Spin>

                    </div>
                </div>
                {/* <!-- .content --> */}
            </div>
            {/* <!-- /#right-panel --> */}

            {/* <!-- Right Panel --> */}
        </div>
    );
  }
}

export default TasksPage;
