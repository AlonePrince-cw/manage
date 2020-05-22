import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 员工分页查询
 * @param {String} params
 * fullName
 * token
 */
export function memberManagePage (params){
    return request({
        url:'api/dispatch/pc/110205',
        method: 'get',
        params: params
    })
}
/**
 * 新增员工
 * @param {String} params
 */
export function organizationAdd (params){
    return request({
        url:'api/dispatch/pc/110101',
        method: 'post',
        params: params
    })
}
/**
 * 修改员工
 * @param {String} params
 */
export function organizationEdit (params){
    return request({
        url:'api/dispatch/pc/110103',
        method: 'post',
        params: params
    })
}
/**
 * 员工设置负责人
 * @param {String} params
 */
export function memberSetManager (params){
    return request.post('api/dispatch/pc/110207?token=' + params.token, parse(params))
}
