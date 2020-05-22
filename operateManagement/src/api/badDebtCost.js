import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 收款坏账查询
 * @param {String} params
 * fullName
 * token
 */
//分页查询
export function badDebtCostPage (params){
    return request({
        url:'/api/dispatch/pc/71010805',
        method: 'get',
        params: params
    })
}
//新增加数据接口
export function badDebtCost (params){
    return request({
        url:'/api/dispatch/pc/71010801',
        method: 'post',
        params: params
    })
}
//查看详情接口
export function badDebtCostView(params){
    return request({
        url:'/api/dispatch/pc/71010802',
        method: 'get',
        params: params
    })
}
//编辑(修改)接口
export function badDebtCostEdit (params){
    return request({
        url:'/api/dispatch/pc/71010803',
        method: 'post',
        params: params
    })
}
// 设置有效性的接口
export function badDebtCostEffectiveness(params){
    return request({
        url:'/api/dispatch/pc/71010807',
        method: 'post',
        params: params
    })
}