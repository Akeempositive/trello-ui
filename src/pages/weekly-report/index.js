import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import {getTasksForReport,submitReport} from './index-api'
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Modal,
    Select,
    Button,
    DatePicker,
    Row,
    Col,
    Spin,
    notification,Popconfirm,Table, Divider, Tag
  } from 'antd';
import { stateManager } from '../../utils/state-utils';
import { USER } from '../../constants/index';

const FormItem = Form.Item;
const { Option } = Select;
class WeeklyReportPage extends Component  {
    constructor(props) {
        super(props);
        this.state={
            tasks:[],
            task : {},
            user : {},
            reportNumber : 0,
            noValidTaskForReport: false,
            viewTaskModal: true,
            isloading:true
        }
    }

    nextTask = () => {

        this.state.tasks[this.state.reportNumber] = this.state.task;
        if(this.state.reportNumber == this.state.tasks.length -1) {
            notification['success']({
                message: 'MCS',
                description:
                    `This is the last report on the list.`,
                });
            return;
        }
        
        this.setState({task : this.state.tasks[this.state.reportNumber+1], reportNumber : this.state.reportNumber +1});
    }

    previousTask = () => {
        this.state.tasks[this.state.reportNumber] = this.state.task;
        if(this.state.reportNumber == 0) {
            notification['success']({
                message: 'MCS',
                description:
                    `This is the first report on the list.`,
                });
            return;
        }
        
        this.setState ({task : this.state.tasks[this.state.reportNumber-1], reportNumber : this.state.reportNumber -1});
    }
    componentDidMount(){
        this.state.user = JSON.parse(stateManager(USER));
        this.getAllTask();
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


    handleChange=(value)=>{
        console.log(`selected ${value}`);
    }

    getAllTask = () =>{
        this.setState({isloading:true})
        getTasksForReport(this.state.user.userName)
        .then((response)=>{
            if(response.data.length == 0){
                this.setState({noValidTaskForReport : true})
                return;
            }
            this.setState({tasks : response.data, reportNumber : 0, task : response.data[0]})
        }).catch((error)=>{
            console.log('There is an error fetching all task due for reports')
        })
        this.setState({isloading:false})
    }

    submitReports = () => {
        this.state.tasks[this.state.reportNumber] = this.state.task;
        submitReport(this.state.user.id, this.state.tasks)
        .then (response =>{
            notification['success']({
                message: 'MCS',
                description:
                    `Successfully submitted report for the week.`,
                });
        }).catch(error => {

        })
    }

    showReportFilling = () => {
        if(this.state.noValidTaskForReport){
            return (
                <Form onSubmit={this.handleSubmit} className="signup-form"
                >
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
                        // value={this.state.task.dateOfComplite}
                        onChange={(e) => this.setState({task : {...this.state.task, dateOfComplite : e}})}/>
                </FormItem>

                <FormItem
           >
            <Select value={this.state.task.state} style={{ width: 120 }} 
                onChange = {(e)=>this.setState({task : {...this.state.task, state : e}})}
            >
                <Option value="DONE">Completed</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="STARTED">Started</Option>
                <Option value="CANCELLED">Cancelled</Option>
                <Option value="ALL">All</Option>

            </Select>
        </FormItem>
        <FormItem>
            <button type="button" visible={this.state.reportNumber > 0} onClick = {this.previousTask} className="btn btn-primary btn-flat m-b-30 m-t-30 m-l-10 m-r-10">Previous</button>
            <button type="button" onClick={this.nextTask} className="btn btn-info btn-flat m-b-30 m-t-30 m-l-10 m-r-10">Next</button>
        </FormItem>
        <FormItem>
            <button type="button" onClick = {this.submitReports} className="btn btn-primary btn-flat m-b-30 m-t-30 m-l-10 m-r-10">Submit Report</button>

         </FormItem>
            </Form>
            )
        } else {
            return (
                <label>You currently have no task to give report on. Either wait for new task or for the updated ones to be reviewed</label>
            )
        }
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
            <Navbar></Navbar>
            <div  class="right-panel ">
                <Header></Header>
                <BreadCrumb menu="Reports" submenu=" "></BreadCrumb>

                <div class="content mt-3">

                    <div class="animated fadeIn">
                        <div className="col-md-12">
                                <div className="row">
                                    {this.showReportFilling()}    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
  }
}

export default WeeklyReportPage;
