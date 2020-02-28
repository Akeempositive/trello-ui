import axios from 'axios';
import {USERID, APP_ACCESS_TOKEN, USER, FORBIDDEN_COUNT, APP_CLIENT, APP_PASS, GETMETHOD,POSTMETHOD,PUTMETHOD,USER_ACCESS_TOKEN,USER_AUTHORITIES,USER_TOKEN_EXPIRATION,TOKEN_DATE, DELETEMETHOD} from '../constants'
import jwtDecode from "jwt-decode";

 export const axiosRequest = options =>{
    let setHeader = {}
    

    if (options.useBasic) {
        let tempHeaders={Authorization:`${getBasicAuth(APP_CLIENT, APP_PASS)}`}
        setHeader = {...setHeader, ...tempHeaders}
    }

    if (options.useAppAccessToken && localStorage.getItem(APP_ACCESS_TOKEN)) {
        let tempHeaders = {Authorization: localStorage.getItem(APP_ACCESS_TOKEN)}
        setHeader = {...setHeader, ...tempHeaders}
    }

    if (options.userAccessToken && localStorage.getItem(USER_ACCESS_TOKEN)) {
        let tempHeaders = {Authorization: localStorage.getItem(USER_ACCESS_TOKEN)}
        setHeader = {...setHeader, ...tempHeaders}
    }

    if(options.headerType){
        let tempHeaders = {'Content-Type' : options.headerType}
        setHeader = {...setHeader, ...tempHeaders}
    }

    setHeader["Access-Control-Allow-Origin"] =  "*";

    // if(options.useClientToken){
    //     let tempHeaders={Authorization:`Bearer ${getClientToken()}`}
    //     setHeader = {...setHeader, ...tempHeaders}
    // }

    options.headerRequest = {headers:setHeader}
    
    if(options.headerTypeData){
        options.headerRequest.data = {}
    }

    console.log("options.headerRequest");

    console.log(options.headerRequest);

    let apiRequest = null;

    switch (options.method) {
        case GETMETHOD:
            apiRequest = axios.get(options.url,options.headerRequest)
        break;
        
        case POSTMETHOD:
            apiRequest= axios.post(options.url, options.data, options.headerRequest);
        break;
        
        case PUTMETHOD:
            apiRequest= axios.put(options.url, options.data,options.headerRequest);
        break;

        case DELETEMETHOD:
            apiRequest = axios.delete(options.url,options.headerRequest)
        break;

        default:
          apiRequest = null;
    }

    // console.log("apiRequest")

    // console.log(apiRequest);

    checkifStatusIsForbidden(apiRequest);

    return apiRequest;

}

const checkifStatusIsForbidden = (response)=>{
    response.
    then(response =>{
        
    })
    .catch((error)=> {
        console.log("checkifStatusIsForbidden");
        if(error.response && error.response.status && error.response.status== 403){
            let count=0;
            if(localStorage.getItem(FORBIDDEN_COUNT)){
                count=parseInt(localStorage.getItem(FORBIDDEN_COUNT))
            };
            count = count + 1
            localStorage.setItem(FORBIDDEN_COUNT, count)
        }
        // localStorage.setItem()
       // console.log(error.response.status || 'Not Available');

    });
}

const getBasicAuth = (username, password) => {
    const hash = new Buffer(username + ':' + password).toString('base64');
    console.log(hash);
    return "Basic " + hash;
};

export const axiosLoginRequest = options =>{
    let setHeader = {}
    

    if (options.useBasic) {
        let tempHeaders={"Authorization":`${getBasicAuth(APP_CLIENT, APP_PASS)}`}
        setHeader = {...setHeader, ...tempHeaders}
    }

    
    if(options.headerType){
        let tempHeaders = {'Content-Type' : options.headerType}
        setHeader = {...setHeader, ...tempHeaders}
    }

    let basic = getBasicAuth(APP_CLIENT, APP_PASS)
   // let head = {headers:{"Authorization": basic,'Content-Type': "application/x-www-form-urlencoded"}, data:{}}
    // options.headerRequest = {headers:setHeader, data:{}}
    // options.headerRequest.data = {}

    console.log("options.headerRequest");

    //console.log(head);

    let apiRequest= axios.post(options.url, options.data);

    return apiRequest;

}

export const storeJwtAccessToken = (accessToken)=>{
    localStorage.setItem(USER_ACCESS_TOKEN, accessToken.token);
    localStorage.setItem(USER, accessToken.user);
    localStorage.setItem(USERID, accessToken.user.id);
    localStorage.setItem(USER_AUTHORITIES,accessToken.authorities)
}
export const storeJwtExpireToken = (tokenExpirationTime) =>{
    localStorage.setItem(TOKEN_DATE, Date.now())
    localStorage.setItem(USER_TOKEN_EXPIRATION,tokenExpirationTime)  
}

export const isUserAuthenticated = () =>{
    // let accessToken = localStorage.getItem(USER_ACCESS_TOKEN);
    if(localStorage.getItem(USER_ACCESS_TOKEN)==null){
        console.log("false")
        return false
    }
    else if(localStorage.getItem(USER_ACCESS_TOKEN)){
        let startDate = localStorage.getItem(TOKEN_DATE);
        let endDate = Date.now();
        let timeExpiration = localStorage.getItem(USER_TOKEN_EXPIRATION);
        console.log("TimeExpiration");
        console.log(timeExpiration)
        let timeDifference = endDate-startDate;
        let timeDifferenceInSeconds = timeDifference/1000
        console.log("TimeDifferenceInSeconds")
        console.log(timeDifferenceInSeconds)

        if(timeDifferenceInSeconds > timeExpiration){
            return false;
        }
        return true;
    }
    
    return false;

}

export const hasAuthority=(requiredAuthorities)=>{
    let assignedAuthority = localStorage.getItem(USER_AUTHORITIES)
    // console.log("assignedAuthority")
    // console.log(assignedAuthority)
    assignedAuthority = assignedAuthority.split(",");
    // console.log("assignedAuthority in split format")
    // console.log(assignedAuthority)
    let truthvalue = false;
    requiredAuthorities.forEach(authority => {
        if(assignedAuthority.includes(authority)){
            truthvalue = true;
            return ;
        }    
     });
     return truthvalue;
}

export const getForbiddenCount=(redirect)=>{
    // this.props.history.push(`/single-user/${record.id}`)
    if(localStorage.getItem(FORBIDDEN_COUNT)){
        let count=parseInt(localStorage.getItem(FORBIDDEN_COUNT))
        if(count >= 3){
            redirect(`/`)
        }
    };
}




