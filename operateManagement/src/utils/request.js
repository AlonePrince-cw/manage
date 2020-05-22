import axios from 'axios'
import { removeUser, getSite, getUser } from '@/utils/auth'
import { Message } from 'element-ui'
import Qs from 'qs'
import storeData from '@/store/state'
const service = axios.create({
  baseURL: storeData.BASE_API + storeData.uploadPrefix, // api 的 base_url
  // baseURL: `${process.env.VUE_APP_BASE_API}`, // api 的 base_url
  timeout: 100000, // request timeout
  withCredentials: true, // cross origin'
  headers: {
      'content-type': 'application/x-www-form-urlencoded'
  },
  paramsSerializer: function (params) {
    return Qs.stringify(params, { allowDots: true })
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    console.log('before request error ======>' + error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (typeof res === 'object' && res.code === undefined) {
      return res
    }

    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 15 * 1000
      })
      // 未登录或登录过期
      if (res.code === 401) {
        removeUser()
        location.reload() // 为了重新实例化vue-router对象 避免bug
      }
      return Promise.reject(new Error('error'))
    } else {
      return res.rows ? { data: res } : res
    }
  },
  error => {
    console.log('after requrest error ======>' + error) // for debug
    Message({
      message: '网络错误',
      type: 'error',
      duration: 15 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
