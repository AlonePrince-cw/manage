import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 应用管理所有api
 * @param {String} params
 * fullName
 * token
 */
//连接管理分页查询
export function applicationPage (params){
    return request({
        url:'/api/dispatch/pc/71010818',
        method: 'get',
        params: params
    })
}
//连接管理新增项目链接
export function newProjectLink (params){
    return request({
        url:'/api/dispatch/pc/71010816',
        method: 'post',
        params: params
    })
}
//连接管理修改项目链接
export function odifyProjecmtLinks (params){
    return request({
        url:'/api/dispatch/pc/71010817',
        method: 'post',
        params: params
    })
}
//连接管理详情查询
export function queryItemLinkDetails (params){
    return request({
        url:'/api/dispatch/pc/71010819',
        method: 'get',
        params: params
    })
}
