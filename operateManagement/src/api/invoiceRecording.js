import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 开票记录查询
 * @param {String} params
 * fullName
 * token
 */
export function addBillingrecord (params){
    return request({
        url:'/api/dispatch/pc/71010101',
        method: 'post',
        params: params
    })
}

//主页分页接口
export function paginationBillingrecord (params){
    return request({
        url:'/api/dispatch/pc/71010105',
        method: 'get',
        params: params
    })
}
// 查看详情接口
export function viewBillingrecords (params){
    return request({
        url:'/api/dispatch/pc/71010102',
        method: 'get',
        params: params
    })
}
// 编辑接口
export function modifyBillingrecord(params){
    return request({
        url:'/api/dispatch/pc/71010103',
        method: 'post',
        params: params
    })
}
// 设置有效性的接口
export function costEffective(params){
    return request({
      url:'/api/dispatch/pc/71010107',
        method: 'post',
        params: params
    })
  }