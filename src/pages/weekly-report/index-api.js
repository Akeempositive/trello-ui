import {USER,API_BASE_URL, APP_CLIENT, APP_PASS, PAGE_SIZE, CLIENT_TOKEN,GETMETHOD,POSTMETHOD,PUTMETHOD, USERID} from '../../constants';
import {axiosRequest} from  '../../utils/api-utils'
import axios from 'axios';
import { stateManager } from '../../utils/state-utils';



export function getReportsForUser(username) {
    return axiosRequest({
        url: API_BASE_URL + '/api/weeklyReport/getReportsByUsername/'+ username,
        method: GETMETHOD,
        userAccessToken: true,
        headerType: 'application/json'
    });
}

export function getTaskSubmittedForReportByUserId(userId) {
    return axiosRequest({
        url: API_BASE_URL + '/api/tasks/get-all-tasks-by-user-id/'+ userId,
        method: GETMETHOD,
        userAccessToken: true,
        headerType: 'application/json'
    });
}

export function submitReport (userId,report){
    return axiosRequest({
        url: API_BASE_URL + '/api/weeklyReport/submitWeeklyReportByUserId/'+ userId,
        method: POSTMETHOD,
        data : report,
        userAccessToken: true,
        headerType: 'application/json'
    });
}

export function submitReports (userId,reports){
    return axiosRequest({
        url: API_BASE_URL + '/api/weeklyReport/submitWeeklyReportsByUserId/'+ userId,
        method: POSTMETHOD,
        data : reports,
        userAccessToken: true,
        headerType: 'application/json'
    });
}

export function updateComment(report, userRole){
    return axiosRequest({
        url: API_BASE_URL + '/api/weeklyReport/updateCommentByRole/'+ userRole,
        method: POSTMETHOD,
        data : report,
        userAccessToken: true,
        headerType: 'application/json'
    });
}

