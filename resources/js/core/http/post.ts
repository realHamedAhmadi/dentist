import request from './request'

export default async function post(endpoint,body=null){
    return request(endpoint,'POST',body)
}
