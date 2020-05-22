import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 分页查询
 * @param {String} params
 * token
 */
export function contractPage (params){
    return request({
        url:'api/dispatch/pc/8105',
        method: 'get',
        params: params
    })
}

/**
 * 删除合同
 * @param {String} params
 * token
 */
export function contractDel (params){
    return request({
        url:'api/dispatch/pc/510302',
        method: 'post',
        params: params
    })
}

/**
 * 新增合同
 * @param {String} params
 * token
 */
export function contractAdd (params){
    return request.post('api/dispatch/pc/8101?token=' + params.token, parse(params))
}

/**
 * 修改合同
 * @param {String} params
 * token
 */
export function contractEdit (params){
  return request.post('api/dispatch/pc/8103?token=' + params.token, parse(params))
}

