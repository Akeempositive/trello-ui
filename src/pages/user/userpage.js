
import React, { Component } from 'react';
import Header from '../../partials/header';
import Navbar from '../../partials/navbar'
import BreadCrumb from '../../partials/breadcrumb'
import {fetchAllUsers,unBlockUser,blockUser, saveUser} from './user-api'
import {hasAuthority} from  '../../utils/api-utils'
import {CAN_CREATE_USER, CAN_UPDATE_USER, CAN_VIEW_USER} from '../../constants'

import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Modal,
    DatePicker,
    Spin,
    notification,Popconfirm,Table, Divider, Tag
  } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
class UserPage extends Component  {
    constructor(props) {
        super(props);
        this.state={
            users:[],
            isloading:true,
            viewUserType: '',
            userModalVisible: false,
            managers : [{userName : 'Positive', firstName : 'Akeem', lastName : 'Suara'}],
            user : {role: {name : 'ADMIN'}, managerName : ''}
        }
            // this.onsubmitDrug = this.onsubmitDrug.bind(this);
            this.unblockUzer = this.unblockUzer.bind(this);

    }

    componentDidMount(){
        this.getAllUsers()
    }

    // <span class="badge badge-primary">Primary</span>
    //                                 <span class="badge badge-secondary">Secondary</span>
    //                                 <span class="badge badge-success">Success</span>
    //                                 <span class="badge badge-danger">Danger</span>



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

    getTableHeader = ()=>{

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
                    dateOfBirth: new Date(),
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

    deleteDrug = (id)=>{
        console.log( id)

    }
    cancelDrug = ()=>{

    }

    mapDrugTables = () =>{
        let items = <tr style={{ width: '100%' }} className="col-md-12" >No drug</tr>

        if (this.state.drugs) {

            items = this.state.drugs.map(drug => {
              return (
                <tr key={drug.id}>
                    <td>{drug.name}</td>
                    <td>{drug.amount}</td>
                    <td>{drug.alias}</td>
                    <td>
                    <Popconfirm
                        title="Are you sure delete this Item?"
                        onConfirm={(e)=>this.deleteDrug(drug)}
                        onCancel={this.cancelDrug()}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href="#" style={{margin:'5px'}} >Delete</a>
                        {/* <a style={{margin:'5px'}} type="button" class="btn btn-primary">Update</a>     */}
                    </Popconfirm>
                        <button type="button" class="btn btn-primary btn-sm">Delete</button>

                            {/* <Button className='m-1' color="primary" size="xs"
                                onClick={() => { this.setPublicationUpdate(item) }}>
                                Update
                            </Button> */}
                            {/* <Button className='m-1' color="danger" size="xs"
                                onClick={() => { this.deleteItem(item) }}>
                                Delete
                            </Button> */}
                    </td>
                </tr>
              )
            });
        }

        return items;

    }

    updateUser = () => {
        saveUser(this.state.user)
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
    allManagers = () => {
        return (
            this.state.managers.map((item)=>
                <Option value={item.userName}>{item.firstName + ' ' + item.lastName}</Option>
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

    handleUserChange = (e) => {
        console.log('Working yet?')
        this.setState({user : {...this.state.user, key : e.target.value}})
        console.log(this.state.user.userName)
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
                                <div className="card">
                                    <div className="card-header">
                                        <strong className="card-title">Users</strong>
                                        {this.createUserPreviledge()}
                                    </div>
                                    <div className="card-body">
                                        <Table columns={this.getTableHeader()} dataSource={this.state.users} />
                                    </div>

                                </div>
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
                                            <Form onSubmit={this.handleSubmit} className="signup-form">
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

                                    <FormItem
                                        >
                                        <Input
                                            size="large"
                                            name="name"
                                            autoComplete="off"
                                            placeholder="Surname"
                                            value={this.state.user.lastName}
                                            onChange = {(e)=>this.setState({user : {...this.state.user, lastName : e.target.value}})}
                                           />
                                    </FormItem>


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
                                    <FormItem
                                        >
                                        <Select value= {this.state.user.role} style={{ width: 120 }} 
                                        onChange = {(e)=>this.setState({user : {...this.state.user, role : e.target.value}})}>
                                        <Option value="ADMIN">Admin</Option>
                                            <Option value="HOC">HOC</Option>
                                            <Option value="HOD">HOD</Option>
                                            <Option value="MANAGER">Manager</Option>
                                        </Select>
                                    </FormItem>
                                        <FormItem
                                        >
                                            <Select value={this.state.user.managerName} style={{ width: 120 }} 
                                                onChange = {(e)=>this.setState({user : {...this.state.user, managerName : e.target.value}})}>
                                                {this.allManagers}
                                            </Select>
                                        </FormItem>
                                        <FormItem
                                        >
                                            <DatePicker
                                            size="large"
                                            name="Target Date"
                                            autoComplete="off"
                                            placeholder="Date of Birth"
                                            value={this.state.user.birthday}
                                            //onChange = {(e)=>this.setState({user : {...this.state.user, birthday : e.target.value}})}
                                           />
                                        </FormItem>
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

export default UserPage;
