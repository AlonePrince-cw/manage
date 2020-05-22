import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 收款记录查询
 * @param {String} params
 * fullName
 * token
 */
//分页查询
export function financialAnalysisPage (params){
    return request({
        url:'/api/dispatch/pc/710201',
        method: 'get',
        params: params
    })
}
//财务分析弹出框查询
export function financialAnalysisAuery (params){
    return request({
        url:'/api/dispatch/pc/710202',
        method: 'get',
        params: params
    })
}
//新增加数据接口
export function taxExpenditure (params){
    return request({
        url:'/api/dispatch/pc/71010501',
        method: 'post',
        params: params
    })
}
// //查看详情接口
// export function viewDetails (params){
//     return request({
//         url:'/api/dispatch/pc/71010502',
//         method: 'get',
//         params: params
//     })
// }
// //编辑(修改)接口
// export function taxExpenditureEdit (params){
//     return request({
//         url:'/api/dispatch/pc/71010503',
//         method: 'post',
//         params: params
//     })
// }
// // 设置有效性的接口
// export function  taxExpenditureEffectiveness(params){
//     return request({
//         url:'/api/dispatch/pc/71010507',
//         method: 'post',
//         params: params
//     })
// }