import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 费用记录查询
 * @param {String} params
 * fullName
 * token
 */
export function expenseRecord (params){
  return request({
      url:'api/dispatch/pc/71010205',
      method: 'get',
      params: params
  })
}
//增加数据接口
export function confirmCreation (params){
  return request({
      url:'api/dispatch/pc/71010201',
      method: 'post',
      params: params
  })
}
//查看详情接口
export function viewDetails (params){
  return request({
    url:'api/dispatch/pc/71010202',
      method: 'get',
      params: params
  })
}
//编辑(修改)接口
export function modifyExpenseRecord (params){
  return request({
    url:'api/dispatch/pc/71010203',
      method: 'post',
      params: params
  })
}
// 设置有效性的接口
export function  costEffective(params){
  return request({
    url:'api/dispatch/pc/71010207',
      method: 'post',
      params: params
  })
}