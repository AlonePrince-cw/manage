import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 收款记录查询
 * @param {String} params
 * fullName
 * token
 */
// 进页面的分页查询
export function addCollectionRecords (params){
  return request({
      url:'/api/dispatch/pc/71010305',
      method: 'get',
      params: params
  })
}
//新增加数据接口
export function confirmCreation (params){
  return request({
      url:'/api/dispatch/pc/71010301',
      method: 'post',
      params: params
  })
}
//查看详情接口
export function viewDetails (params){
  return request({
    url:'/api/dispatch/pc/71010302',
      method: 'get',
      params: params
  })
}
//编辑(修改)接口
export function modifyExpenseRecord (params){
  return request({
    url:'/api/dispatch/pc/71010303',
      method: 'post',
      params: params
  })
}
// 设置有效性的接口
export function  costEffective(params){
  return request({
    url:'/api/dispatch/pc/71010307',
      method: 'post',
      params: params
  })
}