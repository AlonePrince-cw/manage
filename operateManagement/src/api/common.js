import request from '@/utils/request'
import { getUser,getNode } from '@/utils/auth'

//   获取一级栏目
export function nodePerm (params) {
  return request({
    url: 'api/home/functionPermissions',
    method: 'get',
    params: params
  })
}
//   获取一级栏目
export function getUserMenus (data) {
  return request({
    url: 'api/dispatch/pc/0',
    method: 'post',
    params: {
        token,
        permisionId
    }
  })
}
//获取所有栏目
export function getMenuLists (params) {
  return request({
    url: 'api/home/getIndexMenu',
    method: 'post',
    params: params
  })
}
// 地区选择组件
export function getPlace (params) {
    return request.get('api/home/getRegionTree',{
        params:{
            token:params.token,
            parentId:params.parentId
        }
    })
}

// 用户查询字典表
export function listAllDict (params){
    return request.post('api/home/listAllDict',{
        params:params
    })
}

// 选择部门
export function getOrg (params){
    return request.get('api/home/getOrganizationList',{
        params:{
            token:params.token,
            fullName:"",
            regionTreeCode:""
        }
    })
}

// 选择项目
export function getProject (params){
    return request.get('api/home/getProjectList',{
        params:{
            token:params.token,
            page:params.page,
            size:params.size,
            projectName:params.projectName,
            regionTreeCode:params.regionTreeCode,
            employeeId:params.employeeId,
            projectType:params.projectType,
            startTime:params.startTime,
            endTime:params.endTime,
            fundingStart:params.fundingStart,
            fundingEnd:params.fundingEnd,
            projectStatus:params.projectStatus,
            isValid:params.isValid
        }
    })
}
// 选择员工
export function memberList (params) {
    return request.get('api/home/getEmployeeList',{
        params:{
            token:params.token,
            name:params.name,
            entryTimeStart:params.entryTimeStart,
            entryTimeEnd:params.entryTimeEnd,
            resignationTimeStart:params.resignationTimeStart,
            resignationTimeEnd:params.resignationTimeEnd,
            workStatus:params.workStatus,
            organizationId:params.organizationId,
            phone:params.phone,
            position:params.position
        }
    })
}
//获取地区上级
export function getPlaceParent (params) {
    return request({
        url: 'api/home/getRegionParent',
        method: 'get',
        params: params
    })
}
// 新增附件
export function editAddFiles (params) {
    return request({
        url: 'api/dispatch/pc/110211',
        method: 'post',
        params: params
    })
}
// 工作分析
export function workAnalyse (params) {
  return request({
    url: 'api/dispatch/pc/6101',
    method: 'get',
    params: params
  })
}
// 查询总统计
export function workAnalyseTotal (params) {
  return request({
    url: 'api/dispatch/pc/6102',
    method: 'get',
    params: params
  })
}

// 查询栏目
export function getTreeAllMenus (params) {
  return request({
    url: 'api/dispatch/pc/207',
    method: 'get',
    params: params
  })
}

// 查询字典树
export function getTreeAllDict (params) {
  return request({
    url: 'api/home/listAllDictByType',
    method: 'post',
    params: params
  })
}

// 查询所有字典树
export function getTreeAllDicts (params) {
  return request({
    url: 'api/dispatch/pc/9101',
    method: 'get',
    params: params
  })
}
