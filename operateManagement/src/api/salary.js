import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 分页查询
 * @param {String} params
 * token
 */
export function salaryPage (params){
    return request({
        url:'api/dispatch/pc/110501',
        method: 'get',
        params: params
    })
}
/**
 * 评论薪酬
 * @param {String} params
 * token
 */
export function salaryComment (params){
    return request({
        url:'api/dispatch/pc/510405',
        method: 'post',
        params: params
    })
}
/**
 * 删除薪酬
 * @param {String} params
 * token
 */
export function salaryDel (params){
    return request({
        url:'api/dispatch/pc/510302',
        method: 'post',
        params: params
    })
}
/**
 * 新增薪酬
 * @param {String} params
 * token
 */
export function salaryAdd (params){
    return request.post('api/dispatch/pc/110502?token=' + params.token, parse(params))
}

/**
 * 编辑薪酬
 * @param {String} params
 * token
 */
export function salaryEdit (params){
  return request.post('api/dispatch/pc/110503?token=' + params.token, parse(params))
}

/**
 * 标记已阅读薪酬
 * @param {String} params
 * token
 */
export function readsalary (params){
    return request({
        url:'api/dispatch/pc/510403',
        method: 'post',
        params: params
    })
}

