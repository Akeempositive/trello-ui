import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import{tasks} from '../tasks/dashboard-datasource'
// import {hasAuthority} from  '../../utils/api-utils'

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
            name:"",
            description:"",
            status:"",
            completionDate:new Date(),
            isloading:true
        }
            // this.onsubmitDrug = this.onsubmitDrug.bind(this);

    }

    componentDidMount(){
        this.getAllTask()
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
        }
        return (
            <span className={badge.clazz}>
                {badge.display}
            </span>
        );
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
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'CurrentStatus',
                dataIndex: 'status',
                key: 'status',
                render: status => (
                    <span>
                        {this.getTaskStatus(status)}
                    </span>
                  ),
            },
            {
                title: 'Date completed',
                dataIndex: 'completionDate',
                key: 'completionDate',
            },
            {
                title: 'Updated Status',
                dataIndex: 'updatedStatus',
                key: 'updatedStatus',
                render: status => (
                                    <Select style={{ width: 120 }}>
                                          <Option value="COMPLETED" >Completed</Option>
                                          <Option value="PENDING" >Pending</Option>
                                          <Option value="STARTED" >Started</Option>
                                          <Option value="CANCELLED">Cancelled</Option>
                                    </Select>
                                  ),
            }
          ];

        return columns
    }


    handleChange=(value)=>{
        console.log(`selected ${value}`);
    }

    getAllTask = () =>{
        this.setState({isloading:true})
        this.setState({tasks:tasks});


        this.setState({isloading:false})
    }

    createTask = () => {
        console.log('Creating task')
    }

    cancelCreateTaskModal = () => {
        this.setState({visible:false})
    }

    searchTaskByParameters = (e) =>{
        e.preventDefault();
        console.log('I m searching by parameter');
    }

    viewTaskModal =()=>{
        this.setState({visible:true})
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
                        <div className="row">
                            <div className="col-md-12">
                                <Form  layout="inline" onSubmit={this.searchTaskByParameters} className="signup-form">
                                    <FormItem>
                                       <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="Task Name name"
                                            value={this.state.name.value}
                                          />
                                    </FormItem>

                                    <FormItem>
                                        <Input
                                            size="large"
                                            name="amount"
                                            autoComplete="off"
                                            placeholder="Description"
                                            value={this.state.description.value}
                                           />
                                    </FormItem>

                                    <FormItem
                                       >
                                        <Select firstActiveValue="COMPLETED" style={{ width: 120 }} onChange={this.handleChange}>
                                            <Option value="COMPLETED">Completed</Option>
                                            <Option value="PENDING">Pending</Option>
                                            <Option value="STARTED">Started</Option>
                                            <Option value="CANCELLED">Cancelled</Option>

                                        </Select>
                                    </FormItem>

                                    <FormItem>
                                        <DatePicker
                                            value={this.state.completionDate.value}
                                            />
                                    </FormItem>

                                    <FormItem>
                                      <Button type="primary" icon="search">
                                            Looking
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
                                        <span className="pull-right">
                                            <a onClick={()=>{this.viewTaskModal()}}><Icon type="plus-circle" /></a>
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <Table columns={this.getTableHeader()} dataSource={this.state.tasks} />
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-12">
                                <Modal
                                    title="Create Task "
                                    visible={this.state.visible}
                                    onOk={this.createTask}
                                    // okButtonProps={{ disabled: this.isFormInvalid() }}
                                    onCancel={this.cancelCreateTaskModal}
                                    okText="UPDATE"
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
                                            value={this.state.name.value}
                                            onChange={(event) => this.handleInputChange(event, this.validateInput)}/>
                                    </FormItem>

                                    <FormItem
                                        // label="Amount"
                                        // validateStatus={this.state.amount.validateStatus}
                                        // help={this.state.amount.errorMsg}
                                        >
                                        <Input
                                            size="large"
                                            name="amount"
                                            autoComplete="off"
                                            placeholder="Description"
                                            value={this.state.description.value}
                                            onChange={(event) => this.handleInputChange(event, this.validateInput)}/>
                                    </FormItem>

                                    <FormItem
                                        // label="Alias"
                                        // validateStatus={this.state.alias.validateStatus}
                                        // help={this.state.alias.errorMsg}
                                        >
                                        <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
                                        <Option value="COMPLETED">Completemmd</Option>
                                            <Option value="PENDING">Pending</Option>
                                            <Option value="STARTED">Started</Option>
                                            <Option value="CANCELLED">Cancelled</Option>
                                        </Select>
                                    </FormItem>

                                    <FormItem
                                        >
                                        <DatePicker
                                            size="large"
                                            name="Target Date"
                                            autoComplete="off"
                                            placeholder="completion Date"
                                            value={this.state.completionDate.value}
                                            onChange={(event) => this.handleInputChange(event, this.validateInput)}/>
                                    </FormItem>

                                                {/* <FormItem>
                                                    <Button type="primary"
                                                            htmlType="submit"
                                                            size="large"
                                                            className="signup-form-button"
                                                            disabled={this.isFormInvalid()}>Update</Button>
                                                </FormItem> */}
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
