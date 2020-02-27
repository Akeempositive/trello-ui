import {API_BASE_URL, APP_CLIENT, APP_PASS, PAGE_SIZE, CLIENT_TOKEN,GETMETHOD,POSTMETHOD,PUTMETHOD} from '../../constants';
import {axiosLoginRequest,storeJwtAccessToken,storeJwtExpireToken} from  '../../utils/api-utils'
import axios from 'axios';



export function login(loginRequest) {
    loginRequest.grant_type = 'password';
    loginRequest.scope = 'profile';

    let formBody = [];
    for (let property in loginRequest) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(loginRequest[property]);
        formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');
    console.log(formBody); return axiosLoginRequest({
        url: API_BASE_URL + '/api/auth/login',
        method: POSTMETHOD,
        data: {email: loginRequest.email, password: loginRequest.password, username: loginRequest.email},
        headerType: 'application/json'
    });
}

export const storeToken= (token) =>{
    storeJwtAccessToken(token);
    storeJwtExpireToken(token.expireAt)
}


