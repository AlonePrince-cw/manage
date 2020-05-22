import request from '@/utils/request'
import { parse } from '@/utils/util'

/**
 * 分页查询
 * @param {String} params
 * token
 */
export function rewardPage (params){
    return request({
        url:'api/dispatch/pc/11030105',
        method: 'get',
        params: params
    })
}

/**
 * 删除记录
 * @param {String} params
 * token
 */
export function rewardDel (params){
    return request({
        url:'api/dispatch/pc/510302',
        method: 'post',
        params: params
    })
}

/**
 * 新增记录
 * @param {String} params
 * token
 */
export function rewardAdd (params){
    return request.post('api/dispatch/pc/11030101?token=' + params.token, parse(params))
}

/**
 * 编辑记录
 * @param {String} params
 * token
 */
export function rewardEdit (params){
  return request.post('api/dispatch/pc/11030103?token=' + params.token, parse(params))
}



/**
 * 惩罚分页查询
 * @param {String} params
 * token
 */
export function penaltyPage (params){
  return request({
    url:'api/dispatch/pc/11030205',
    method: 'get',
    params: params
  })
}

/**
 * 惩罚删除记录
 * @param {String} params
 * token
 */
export function penaltyDel (params){
  return request({
    url:'api/dispatch/pc/11030204',
    method: 'post',
    params: params
  })
}

/**
 * 惩罚新增记录
 * @param {String} params
 * token
 */
export function penaltyAdd (params){
  return request.post('api/dispatch/pc/11030201?token=' + params.token, parse(params))
}

/**
 * 惩罚编辑记录
 * @param {String} params
 * token
 */
export function penaltyEdit (params){
  return request.post('api/dispatch/pc/11030203?token=' + params.token, parse(params))
}

