import request from '@/utils/request'
import { getUser, getNode } from '@/utils/auth'

/**
 * 栏目列表查询
 * @param {String} params
 * page
 * token
 */
export function menuListPage (params) {
  return request({
    method: 'GET',
    url: '/api/dispatch/pc/205',
    params: params
  })
}

/**
 * 栏目新增
 * @param {String} params
 * page
 * token
 */
export function addMenu (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/201',
    params: params
  })
}

/**
 * 栏目新增
 * @param {String} params
 * page
 * token
 */
export function editMenu (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/203',
    params: params
  })
}

/**
 * 栏目删除
 * @param {String} params
 * id
 * token
 */
export function menuDel (params) {
  return request({
    method: 'post',
    url: '/api/dispatch/pc/204',
    params: params
  })
}



