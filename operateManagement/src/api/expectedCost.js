import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 预期成本查询
 * @param {String} params
 * fullName
 * token
 */
//分页查询
export function expectedCostPage (params){
    return request({
        url:'/api/dispatch/pc/71010705',
        method: 'get',
        params: params
    })
}
//新增加数据接口
export function expectedCost (params){
    return request({
        url:'/api/dispatch/pc/71010701',
        method: 'post',
        params: params
    })
}
//查看详情接口
export function expectedCostView(params){
    return request({
        url:'/api/dispatch/pc/71010702',
        method: 'get',
        params: params
    })
}
//编辑(修改)接口
export function expectedCostEdit (params){
    return request({
        url:'/api/dispatch/pc/71010703',
        method: 'post',
        params: params
    })
}
// 设置有效性的接口
export function expectedCostEffectiveness(params){
    return request({
        url:'/api/dispatch/pc/71010707',
        method: 'post',
        params: params
    })
}