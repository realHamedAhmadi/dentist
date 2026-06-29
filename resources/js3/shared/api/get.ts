import request from './apiService'

export default async function get(endpoint,body=null){
    return request(endpoint,'GET',body)
}
