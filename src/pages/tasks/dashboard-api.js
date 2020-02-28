import {API_BASE_URL, APP_CLIENT, APP_PASS, PAGE_SIZE, CLIENT_TOKEN,GETMETHOD,POSTMETHOD,PUTMETHOD, USER, USERID} from '../../constants';
import {axiosRequest} from  '../../utils/api-utils'
import {state} from '../../utils/state-utils'
import axios from 'axios';

export function getTaskByUserId() {
     return axiosRequest({
        url: API_BASE_URL + '/api/tasks/getTaskByUserId/'+ 2,//state(USERID)  ,
        method: GETMETHOD,
        userAccessToken:true,
        headerType: 'application/json'
    });
}

export function submitWeeklyReport(data){
    return axiosRequest({
         url: API_BASE_URL + '/api/tasks/submitweeklyReportByUserId/'+ state(USERID)  ,
         method: POSTMETHOD,
         data : data,
         userAccessToken:true,
         headerType: 'application/json'
    })
}

export function createTask(task){
    return axiosRequest({
        url: API_BASE_URL + '/api/tasks/add',
        method: POSTMETHOD,
        data : task,
        userAccessToken:true,
        headerType: 'application/json'
   })
}