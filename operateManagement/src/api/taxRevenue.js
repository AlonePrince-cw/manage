import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 收款记录查询
 * @param {String} params
 * fullName
 * token
 */
//分页查询
export function taxRevenuePage (params){
    return request({
        url:'/api/dispatch/pc/71010605',
        method: 'get',
        params: params
    })
}
//新增加数据接口
export function taxRevenue (params){
    return request({
        url:'/api/dispatch/pc/71010601',
        method: 'post',
        params: params
    })
}
//查看详情接口
export function taxRevenueView(params){
    return request({
        url:'/api/dispatch/pc/71010602',
        method: 'get',
        params: params
    })
}
//编辑(修改)接口
export function taxRevenueEdit (params){
    return request({
        url:'/api/dispatch/pc/71010603',
        method: 'post',
        params: params
    })
}
// 设置有效性的接口
export function taxRevenueEffectiveness(params){
    return request({
        url:'/api/dispatch/pc/71010607',
        method: 'post',
        params: params
    })
}