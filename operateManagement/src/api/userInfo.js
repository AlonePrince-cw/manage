import request from '@/utils/request'
import { getUser, getNode } from '@/utils/auth'

/**
 * 账户查询
 * @param {String} params
 * page
 * token
 */
export function userManagerPage (params) {
  return request({
    method: 'GET',
    url: '/api/dispatch/pc/402',
    params: params
  })
}
/**
 * 新增账户
 * @param {String} params
 * page
 * token
 */
export function addAccount (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/401',
    params: params
  })
}
/**
 * 修改账号信息
 * @param {String} params
 * page
 * token
 */
export function editAccount (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/406',
    params: params
  })
}
/**
 * 修改密码
 * @param {String} params
 * page
 * token
 */
export function editPas (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/403',
    params: params
  })
}
/**
 * 查询角色
 * @param {String} params
 * id
 * token
 */
export function roleList (params) {
  return request({
    method: 'get',
    url: '/api/dispatch/pc/407',
    params: params
  })
}

/**
 * 启用禁用
 * @param {String} params
 * id
 * token
 */
export function enableDisabled (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/405',
    params: params
  })
}


/**
 *删除
 * @param {String} params
 * id
 * token
 */
export function deleteDictionary (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/404',
    params: params
  })
}






