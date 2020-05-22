import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 分页查询
 * @param {String} params
 * token
 */
export function reportPage (params){
    return request({
        url:'api/dispatch/pc/510303',
        method: 'get',
        params: params
    })
}
/**
 * 评论日报
 * @param {String} params
 * token
 */
export function reportComment (params){
    return request({
        url:'api/dispatch/pc/510405',
        method: 'post',
        params: params
    })
}
/**
 * 删除日报
 * @param {String} params
 * token
 */
export function reportDel (params){
    return request({
        url:'api/dispatch/pc/510302',
        method: 'post',
        params: params
    })
}
/**
 * 新增日报
 * @param {String} params
 * token
 */
export function reportAdd (params){
    return request.post('api/dispatch/pc/510301?token=' + params.token, parse(params))
}
/**
 * 收到的日报
 * @param {String} params
 * token
 */
export function getReportPage (params){
    return request({
        url:'api/dispatch/pc/510401',
        method: 'get',
        params: params
    })
}

/**
 * 标记已阅读日报
 * @param {String} params
 * token
 */
export function readReport (params){
    return request({
        url:'api/dispatch/pc/510403',
        method: 'post',
        params: params
    })
}

/**
 * 日报接收范围
 * @param {String} params
 * token
 */
export function reportRange (params){
  return request({
    url:'api/dispatch/pc/510309',
    method: 'get',
    params: params
  })
}
