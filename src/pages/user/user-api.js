import {USERID, APP_ACCESS_TOKEN,API_BASE_URL,GETMETHOD,POSTMETHOD,PUTMETHOD,DELETEMETHOD} from '../../constants';
import { notification} from 'antd';
import {axiosRequest} from  '../../utils/api-utils'
import {stateManager} from '../../utils/state-utils'





export const fetchAllUsers= async(form)=>{
    return axiosRequest({
        userAccessToken: true,
        headerType:`application/json`,
        url: `${API_BASE_URL}/api/users/getAllVisibleUserById/` + stateManager(USERID),
        method: GETMETHOD
    })
}

export const saveUser = async(user) => {
    return axiosRequest({
        userAccessToken: true,
        headerType:`application/json`,
        data : user,
        url: `${API_BASE_URL}/api/users/add`,
        method: POSTMETHOD
    })
}

export const blockUser= async(email)=>{
    let form ={email:email}
    console.log("blockUser")    
     return axiosRequest({
        userAccessToken: true,
        data:{requestBody:form},
        headerType:`application/json`,
        headerTypeData:true,
        url: `${API_BASE_URL}/api/v1/user/block-user-by-email`,
        method: PUTMETHOD
    })
}

export function getTaskByUserId(userId) {
    return axiosRequest({
       url: API_BASE_URL + '/api/tasks/getTaskByUserId/'+ userId  ,
       method: GETMETHOD,
       userAccessToken:true,
       headerType: 'application/json'
   });
}

export const unBlockUser= async(email)=>{
    let form ={email:email}
    console.log("unBlockUser")    
     return axiosRequest({
        userAccessToken: true,
        data:{requestBody:form},
        headerType:`application/json`,
        headerTypeData:true,
        url: `${API_BASE_URL}/api/v1/user/unblock-user-by-email`,
        method: PUTMETHOD
    })
}

export const getAllDepartments= async()=>{
     return axiosRequest({
        userAccessToken: true,
        headerType:`application/json`,
        headerTypeData:true,
        url: `${API_BASE_URL}/api/users/getAllDepartments`,
        method: GETMETHOD
    })
}



export const searchByFilter= async(data)=>{
    return axiosRequest({
       userAccessToken: true,
       headerType:`application/json`,
       headerTypeData:true,
       data : data,
       url: `${API_BASE_URL}/api/users/searchUserByParameters/` + stateManager(USERID),
       method: POSTMETHOD
   })
}

export const getReportsByUsername = async(username) =>{
    return axiosRequest({
        url: API_BASE_URL + '/api/weeklyReport/getReportsByUsername/'+ username,
        method: GETMETHOD,
        userAccessToken: true,
        headerType: 'application/json'
    });
}


