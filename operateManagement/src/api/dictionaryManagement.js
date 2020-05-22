import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 字典管里
 * @param {String} params
 * fullName
 * token
 */
//分页查询
export function dictionaryManagementPage (params){
    return request({
        url:'/api/dispatch/pc/9101',
        method: 'get',
        params: params
    })
}
//查询下级
export function querySubordinate (params){
    return request({
        url:'/api/dispatch/pc/9102',
        method: 'get',
        params: params
    })
}

//新增字典接口值
export function newDictionaryValue (params){
    return request({
        url:'/api/dispatch/pc/9103',
        method: 'post',
        params: params
    })
}
//修改字典值接口
export function modifyDictionary (params){
    return request({
        url:'/api/dispatch/pc/9104',
        method: 'post',
        params: params
    })
}
//删除字典接口

export function deleteDictionary (params){
    return request({
        url:'/api/dispatch/pc/9106',
        method: 'post',
        params: params
    })
}
//启用禁用接口
export function enableProhibit (params){
    return request({
        url:'/api/dispatch/pc/9105',
        method: 'post',
        params: params
    })
}

//修改排序号
export function changeValues (params){
    return request({
        url:'/api/dispatch/pc/9107',
        method: 'post',
        params: params
    })
}