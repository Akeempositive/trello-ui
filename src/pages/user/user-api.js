import {USERID, APP_ACCESS_TOKEN,API_BASE_URL,GETMETHOD,POSTMETHOD,PUTMETHOD,DELETEMETHOD} from '../../constants';
import { notification} from 'antd';
import {axiosRequest} from  '../../utils/api-utils'
import {state} from '../../utils/state-utils'





export const fetchAllUsers= async(form)=>{
    return axiosRequest({
        userAccessToken: true,
        headerType:`application/json`,
        url: `${API_BASE_URL}/api/users/getAllVisibleUserById/` + state(USERID),
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
