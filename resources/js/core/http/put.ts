import request from './request'

export default async function post(endpoint,body=null){
    return request(endpoint,'PUT',body)
}
