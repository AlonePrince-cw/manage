import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getUser } from './utils/auth'

const whiteList = ['/login', '/404', '/401', '/encryptLink','/public/report.xlsx']

router.beforeEach((to, from, next) => {
  NProgress.start()

  if (getUser()) {
    if (to.path === '/login') {
      next({ path: '/login' })
      // next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
