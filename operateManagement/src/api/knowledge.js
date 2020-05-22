import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 组织分页查询
 * @param {String} params
 * fullName
 * token
 */
export function knowledgeListPage (params){
    return request({
        url:'api/dispatch/pc/3105',
        method: 'get',
        params: params
    })
}
/**
 * 创建主题
 * @param {String} params
 * token
 */
export function themeAdd (params){
    return request.post('api/dispatch/pc/3101?token=' + params.token, parse(params))
}
/**
 * 修改主题
 * @param {String} params
 * token
 */
export function themeEdit (params){
    return request.post('api/dispatch/pc/3103?token=' + params.token, parse(params))
}

/**
 * 查询主题详情
 * @param {String} params
 * fullName
 * token
 */
export function knowledgeQueryOne (params){
    return request({
        url:'api/dispatch/pc/3102',
        method: 'get',
        params: params
    })
}

/**
 * 组织分页查询
 * @param {String} params
 * fullName
 * token
 */
export function knowledgePage (params){
    return request({
        url:'api/dispatch/pc/3111',
        method: 'get',
        params: params
    })
}

/**
 * 知识点添加
 * @param {String} params
 * token
 */
export function knowledgeAdd (params){
    return request.post('api/dispatch/pc/3107?token=' + params.token, parse(params))
}

/**
 * 修改知识点
 * @param {String} params
 * token
 */
export function knowledgeEdit (params){
    return request.post('api/dispatch/pc/3108?token=' + params.token, parse(params))
}
/**
 * 查询知识点详情
 * @param {String} params
 * fullName
 * token
 */
export function knowledgeInfo (params){
  return request({
    url:'api/dispatch/pc/3109',
    method: 'get',
    params: params
  })
}