import request from '@/utils/request'
import { getUser, getNode } from '@/utils/auth'
import { parse } from '@/utils/util'


/**
 * 角色列表查询
 * @param {String} params
 * page
 * token
 */
export function roleListPage (params) {
  return request({
    method: 'GET',
    url: '/api/dispatch/pc/305',
    params: params
  })
}

/**
 * 新增角色
 * @param {String} params
 * page
 * token
 */
export function roleAdd (params) {
  return  request.post('api/dispatch/pc/301?token=' + params.token, parse(params))
}
/**
 * 修改角色
 * @param {String} params
 * page
 * token
 */
export function roleEdit (params) {
  // return
  // request({
  //   method: 'post',
  //   url: '/api/dispatch/pc/303',
  //   params: params
  // })
  // return  request.post('/api/dispatch/pc/303?token=' + vm.token, parse(params))
  return  request.post('api/dispatch/pc/303?token=' + params.token, parse(params))
}
/**
 * 修改角色
 * @param {String} params
 * page
 * token
 */
export function roleCheck (params) {
  return request({
    method: 'get',
    url: '/api/dispatch/pc/316',
    params: params
  })
}
/**
 * 查询权限
 * @param {String} params
 * page
 * token
 */
export function permList (params) {
  return request({
    method: 'get',
    url: '/api/dispatch/pc/313',
    params: params
  })
}

/**
 * 排序
 * @param {String} params
 * page
 * token
 */
export function sortChange (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/315',
    params: params
  })
}


/**
 * 启用禁用接口
 * @param {String} params
 * page
 * token
 */
export function enableDisabled (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/314',
    params: params
  })
}



/**
 * 删除接口
 * @param {String} params
 * page
 * token
 */
export function deleteDictionary (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/304',
    params: params
  })
}


/**
 * 提交接口
 * @param {String} params
 * page
 * token
 */
export function submission (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/318',
    params: params
  })
}

/**
 * 绑定权限
 * @param {String} params
 * page
 * token
 */
export function jurisdiction (params) {
  return request({
    method: 'get',
    url: '/api/dispatch/pc/317',
    params: params
  })
}




