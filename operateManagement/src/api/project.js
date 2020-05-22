import request from '@/utils/request'
/**
 * 项目分页查询
 * @param {String} params
 * token
 */
export function projectPage (params){
    return request({
        url:'api/dispatch/pc/4105',
        method: 'get',
        params: params
    })
}

/**
 * 项目分页查询
 * @param {String} params
 * token
 */
export function contractPageDetails (params){
  return request({
    url:'api/dispatch/pc/4119',
    method: 'get',
    params: params
  })
}

/**
 * 项目分页查询
 * @param {String} params
 * token
 */
export function projectValid (params){
    return request({
        url:'api/dispatch/pc/4107',
        method: 'post',
        params: params
    })
}

