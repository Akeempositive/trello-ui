import {API_BASE_URL, APP_CLIENT, APP_PASS, PAGE_SIZE, CLIENT_TOKEN,GETMETHOD,POSTMETHOD,PUTMETHOD} from '../../constants';
import {axiosRequest} from  '../../utils/api-utils'

export function resetPassword(data) {
    return axiosRequest({
        url: API_BASE_URL + '/api/users/resetPasswordByUserId',
        method: POSTMETHOD,
        data : data,
        userAccessToken: true,
        headerType: 'application/json'
    });
}