import request from '@/utils/request'
/**
 * 组织分页查询
 * @param {String} params
 * fullName
 * token
 */
export function organizationListPage (params){
    return request({
        url:'api/dispatch/pc/110106',
        method: 'get',
        params: params
    })
}
/**
 * 新增组织
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
 * 修改组织
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
 * 组织设置负责人
 * @param {String} params
 */
export function orgSetManager (params){
    return request({
        url:'api/dispatch/pc/110107',
        method: 'post',
        params: params
    })
}
