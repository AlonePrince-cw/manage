import Vue from 'vue'
import store from '@/store'
import { getDict } from '@/utils/auth'
import { dateFormatYmd } from '@/utils/util'
import storeData from '@/store/state'

Vue.filter('dict', function (val, type) {
    let newarr = getDict()
    if (newarr) {
        let v = newarr.filter(item => item.type === type && parseInt(item.id) === parseInt(val))
        if (v.length > 0) {
            return v[0].value
        }
    }
    return ''
})

Vue.filter('dateFormat', function (date, fmt) {
  if(isNaN(date)){
    return date
  }
  if (date) {
    const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    date = date.replace(pattern, '$1/$2/$3 $4:$5:$6');
    date = new Date(date);
    if (fmt) {
      let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    }
  }
  return ''
});

Vue.filter('dateFormatYmdHms', function (data, fmtD, fmtH) {
if (data) {
    let val = data.toString()
    let fmtDay = fmtD || '-'
    let fmtHsm = fmtH || ':'
    let Y = val.substr(0, 4)
    let M = val.substr(4, 2)
    let D = val.substr(6, 2)
    let h = val.substr(8, 2)
    let m = val.substr(10, 2)
    let s = val.substr(12, 2)
    return Y + fmtDay + M + fmtDay + D + ' ' + h + fmtHsm + m + fmtHsm + s
  }
return ''
})

Vue.filter('getFileUrl', function (id) {
    return storeData.downAction + `?code=${id}`
})
Vue.filter('menuType', function (val) {
  let v = ''
  switch (val) {
    case 1 :
      v = '目录'
      break
    case 2 :
      v = '菜单'
      break
    case 3 :
      v = '按钮'
      break
    default:
      v = '其他'
  }
  return v
})

Vue.filter('roleType', function (val) {
  let v = ''
  switch (val) {
    case 1 :
      v = '管理员'
      break
    case 2 :
      v = '客户'
      break
    case 3 :
      v = '第三方系统'
      break
    default:
      v = '其他'
  }
  return v
})