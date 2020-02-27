import {API_BASE_URL, APP_CLIENT, APP_PASS, PAGE_SIZE, CLIENT_TOKEN,GETMETHOD,POSTMETHOD,PUTMETHOD} from '../../constants';
import {axiosRequest} from  '../../utils/api-utils'
import axios from 'axios';

export function getTaskByUsername(loginRequest) {
     return axiosLoginRequest({
        url: API_BASE_URL + '/api/tasks/getTaskByUserId/'+  ,
        method: POSTMETHOD,
        data: {email: loginRequest.email, password: loginRequest.password, username: loginRequest.email},
        headerType: 'application/json'
    });
}