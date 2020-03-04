import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import moment from 'moment'
import Moment from 'react-moment';
import {getReportsForUser,submitReport, submitReports} from './index-api'
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
const {TextArea} = Input;
class WeeklyReportPage extends Component  {
    constructor(props) {
        super(props);
        this.state={
            reports:[],
            report : {},
            user : {},
            reportNumber : 0,
            noValidTaskForReport: false,
            viewTaskModal: true,
            isloading:true
        }
    }

    nextReport = () => {

        this.state.reports[this.state.reportNumber] = this.state.report;
        if(this.state.reportNumber == this.state.reports.length -1) {
            notification['success']({
                message: 'MCS',
                description:
                    `This is the last report on the list.`,
                });
            return;
        }
        
        this.setState({report : this.state.reports[this.state.reportNumber+1], reportNumber : this.state.reportNumber +1});
    }

    previousReport = () => {
        this.state.reports[this.state.reportNumber] = this.state.report;
        if(this.state.reportNumber == 0) {
            notification['success']({
                message: 'MCS',
                description:
                    `This is the first report on the list.`,
                });
            return;
        }
        
        this.setState ({report : this.state.reports[this.state.reportNumber-1], reportNumber : this.state.reportNumber -1});
    }
    componentDidMount(){
        this.state.user = JSON.parse(stateManager(USER));
        this.getAllReports();
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

    getAllReports = () =>{
        this.setState({isloading:true})
        getReportsForUser(this.state.user.userName)
        .then((response)=>{
            if(response.data.length == 0){
                this.setState({noValidTaskForReport : true})
                return;
            }
            this.setState({reports : response.data, isloading : false, report : response.data[0]})
        }).catch((error)=>{
            console.log('There is an error fetching all reports')
        })
        this.setState({isloading:false})
    }

    submitReports = () => {
        submitReports(this.state.user.id, this.state.reports)
        .then (response =>{
            notification['success']({
                message: 'MCS',
                description:
                    `Successfully submitted all reports.`,
                });
        }).catch(error => {

        })
    }

    submitReport = () => {
        submitReport(this.state.user.id, this.state.report)
        .then (response =>{
            notification['success']({
                message: 'MCS',
                description:
                    `Successfully submitted report.`,
                });
        }).catch(error => {

        })
    }

    showReportFilling = () => {
        if(!this.state.noValidTaskForReport){
            return (
                <Form onSubmit={this.handleSubmit} className="signup-form"
                >
                <label>Report Due Date  </label>
            
                <Moment parse="YYYY-MM-DD">{new Date(this.state.report.dueDate)}</Moment>
                <FormItem
            >
            <label>Report Content</label>
                    <TextArea 
                        size="large"
                        name="amount"
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
                        disabled={true}
                        autoSize ={{minRows:3, maxRows : 12}}
                        autoComplete="off"
                        placeholder="HOD Comment"
                        value={this.state.report.hodComment}/>
                </FormItem>
                <FormItem
            >
            <label>HOC Comment</label>
                    <TextArea 
                        size="large"
                        disabled = {true}
                        name="amount"
                        autoSize ={{minRows:3, maxRows : 12}}
                        autoComplete="off"
                        placeholder="HOC Comment"
                        value={this.state.report.hocComment}/>
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
        <FormItem>
            <button type="button" onClick = {this.previousReport} className="pull-left btn btn-primary btn-flat m-b-30 m-t-30 m-l-10 m-r-10">previous Report</button>
            <button type="button" onClick = {this.nextReport} className="pull-right btn btn-primary btn-flat m-b-30 m-t-30 m-l-10 m-r-10">Next Report</button>
        </FormItem>
        <FormItem>
            <button type="button" onClick = {this.submitReport} className="pull-left btn btn-primary btn-flat m-b-30 m-t-30 m-l-10 m-r-10">Submit One</button>
            <button type="button" onClick = {this.submitReports} className="pull-right btn btn-primary btn-flat m-b-30 m-t-30 m-l-10 m-r-10">Submit All Reports</button>
        </FormItem>
            </Form>
            )
        } else {
            return (
                <label>You currently no report. You have to wait for new report to be due</label>
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
