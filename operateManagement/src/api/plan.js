import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 分页查询
 * @param {String} params
 * token
 */
export function planPage (params){
    return request({
        url:'api/dispatch/pc/510105',
        method: 'get',
        params: params
    })
}

/**
 * 分页查询收到的计划
 * @param {String} params
 * token
 */
export function planGetPage (params){
  return request({
    url:'api/dispatch/pc/510201',
    method: 'get',
    params: params
  })
}

/**
 * 删除计划
 * @param {String} params
 * token
 */
export function planDel (params){
    return request({
        url:'api/dispatch/pc/510104',
        method: 'post',
        params: params
    })
}
/**
 * 新增计划
 * @param {String} params
 * token
 */
export function planAdd (params){
    return request.post('api/dispatch/pc/510101?token=' + params.token, parse(params))
}

/**
 * 修改计划
 * @param {String} params
 * token
 */
export function planEdit (params){
  return request.post('api/dispatch/pc/510103?token=' + params.token, parse(params))
}

/**
 * 计划详情
 * @param {String} params
 * token
 */
export function planDetails (params){
  return request({
    url:'api/dispatch/pc/510102',
    method: 'get',
    params: params
  })
}

/**
 * 改变计划事项状态
 * @param {String} params
 * token
 */
export function planStatus (params){
  return request({
    url:'api/dispatch/pc/510108',
    method: 'post',
    params: params
  })
}

