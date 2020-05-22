import request from '@/utils/request'
import { parse } from '@/utils/util'
/**
 * 标记已阅读日报
 * @param {String} params
 * token
 */
export function getCustomerPage (params){
  return request({
    url:'api/dispatch/pc/2104',
    method: 'get',
    params: params
  })
}
/**
 * 添加客户
 * @param {String} params
 * token
 */
export function addCustomer (params){
  return request({
    url:'api/dispatch/pc/2101',
    method: 'post',
    params: params
  })
}
/**
 * 编辑客户
 * @param {String} params
 * token
 */
export function editCustomer (params){
  return request({
    url:'api/dispatch/pc/2103',
    method: 'post',
    params: params
  })
}