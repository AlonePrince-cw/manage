import request from '@/utils/request'
/**
 * 账号登录
 * @param {String} params
 * token
 */
export function loginByUsername (data){
    return request({
        url:'api/home/pc/login',
        method: 'post',
        params: data
    })
}
/**
 * 得到登录账号信息
 * @param {String} params
 * token
 */
export function getUserInfo (data){
    return request({
        url:'api/home/getUserInfo',
        method: 'post',
        params: data
    })
}

export function logout () {
    return ''
}