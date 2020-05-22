import request from '@/utils/request'
// import { parse } from '@/utils/util'
/**
 * 收款记录查询
 * @param {String} params
 * fullName
 * token
 */
// 进页面的分页查询
export function costPage (params){
  return request({
      url:'/api/dispatch/pc/71010405',
      method: 'get',
      params: params
  })
}
//新增加数据接口
export function costIncrease (params){
  return request({
      url:'/api/dispatch/pc/71010401',
      method: 'post',
      params: params
  })
}
//查看详情接口
export function costDetails (params){
  return request({
    url:'/api/dispatch/pc/71010402',
      method: 'get',
      params: params
  })
}
//编辑(修改)接口
export function costModification (params){
  return request({
    url:'/api/dispatch/pc/71010403',
      method: 'post',
      params: params
  })
}
// 设置有效性的接口
export function  costEffectiveness(params){
  return request({
    url:'/api/dispatch/pc/71010407',
      method: 'post',
      params: params
  })
}