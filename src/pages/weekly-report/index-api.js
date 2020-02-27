import {API_BASE_URL, APP_CLIENT, APP_PASS, PAGE_SIZE, CLIENT_TOKEN,GETMETHOD,POSTMETHOD,PUTMETHOD} from '../../constants';
import {axiosRequest,storeJwtAccessToken,storeJwtExpireToken} from  '../../utils/api-utils'
import axios from 'axios';



export function getAllTasksByUserId(userId) {
    return axiosRequest({
        url: API_BASE_URL + '/tasks/get-all-tasks-by-user-id/'+ userId,
        method: GETMETHOD,
        userAccessToken: true,
        headerType: 'application/json'
    });
}

export const storeToken= (token) =>{
    storeJwtAccessToken(token.access_token);
    storeJwtExpireToken(token.expires_in)
}


