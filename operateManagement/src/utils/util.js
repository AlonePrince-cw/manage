import _ from 'lodash'
import Qs from 'qs'
import store from '@/store'
import { getPerm } from "@/utils/auth";
String.prototype.format = function () {
  if (arguments.length === 0) {
    return this
  }
  for (var s = this, i = 0; i < arguments.length; i++) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i])
  }
  return s
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份 
    "d+": this.getDate(),                    //日 
    "h+": this.getHours(),                   //小时 
    "m+": this.getMinutes(),                 //分 
    "s+": this.getSeconds(),                 //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
export function Format(date, fmt) {
  if (fmt) {
    if (typeof date === 'string') {
      const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
      date = date.replace(pattern, '$1/$2/$3 $4:$5:$6')
      date = new Date(date)
    }
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    return fmt
  }
  return ''
}
export function GetAge(identityCard) {
  var len = (identityCard + '').length
  var strBirthday = ''
  // 处理18位的身份证号码从号码中得到生日和性别代码
  if (len === 18 || len === 15) {
    if (len === 18) {
      strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2)
    }
    if (len === 15) {
      var birthdayValue = ''
      birthdayValue = identityCard.charAt(6) + identityCard.charAt(7)
      if (parseInt(birthdayValue) < 10) {
        strBirthday = '20' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
      } else {
        strBirthday = '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
      }
    }
    // 时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday)
    var nowDateTime = new Date()
    var age = nowDateTime.getFullYear() - birthDate.getFullYear()
    // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() === birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  return null
}
export function dateFormatYmdHms(data, fmtD, fmtH) {
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
}
export function dateFormatYmd(data, fmtD, fmtH) {
  if (data) {
    let val = data.toString()
    let fmtDay = fmtD || '-'
    let Y = val.substr(0, 4)
    let M = val.substr(4, 2)
    let D = val.substr(6, 2)
    return Y + fmtDay + M + fmtDay + D
  }
  return ''
}
export function fileString(data, part) {
  let test = '{0}∮{1}∮{2}∮{3}∮{4}'
  let resultData = []
  if (data.length > 0) {
    data.forEach(key => {
      resultData.push(test.format(key.id, part, key.originalName, key.sortNum, key.remark))
    })
    return resultData.join(',')
  }
  return ''
}
export function createFileUrl(file) {
  if (_.isArray(file)) {
    file = file[0]
  }
  if (!file) {
    return ''
  }
  return store.state.downAction + `?code=${file.uniqueCode}`
}

export function mergeDefault(obj, extendObj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      obj[key] = extendObj[key]
    }
  })
}

export function normalizeFiles(files = [], partyPart = '03') {
  return files.map((file, index) => {
    return {
      id: file.id,
      dataType: file.dataType,
      partyPart,
      sortNum: index,
      businessType: file.businessType,
      description: file.description
    }
  })
}

export function parse(data) {
  return Qs.stringify(data, { allowDots: true })
}

export function handleUploadResult(vm, path, response, file, fileList) {
  if (response && response.code === 0) {
    const f = response.data[0]
    _.set(vm, path, f)
  } else {
    fileList = []
    if (response.code === 401) {
      vm.$message.error('登录过期，请重新登录')
      vm.$router.push({ path: '/login', query: { redirect: vm.$route.path } })
    } else {
      vm.$message.error(response.msg)
    }
  }
}
// 地区数据组装
export function packageData(data = []) {
  return data.map(v => ({
    value: {
      value: v.id,
      treeCode: v.treeCode,
      label: v.name,
    },
    label: v.name,
  }))
}
// 栏目数据组装
export function transformOrg2Tree (data = []) {
  return data.map(v => ({
    id: v.id,
    label: v.name,
    isDefaultExpanded: v.state === 'open',
    children: null,
    origin: v
  }))
}

// 字典数据组装
export function transformDictTree (data = []) {
  return data.map(v => ({
    id: v.id,
    label: v.value,
    // isDisabled: v.choose === 0?true:null,
    isDefaultExpanded: v.state === 'open',
    children: null,
    origin: v
  }))
}
// 字典数据组装
export function transformDictTrees (data = []) {
  return data.map(v => ({
    id: v.id+v.type,
    label: v.value,
    // isDisabled: v.choose === 0?true:null,
    isDefaultExpanded: v.state === 'open',
    children: null,
    origin: v
  }))
}

export function getMemberName(str) {
  if (!str) return ''

  return str.split('__')[1]
}

export function getMemberId(str) {
  if (!str) return ''

  return str.split('__')[0]
}

export function bgUrl(name, val) {
  if (name === 'login') {
    return val !== '' && val !== null && val !== undefined ? store.state.downAction + '?id=' + val : null
  } else if (name === 'indexBanner') {
    return val !== '' && val !== null && val !== undefined ? store.state.downAction + '?id=' + val : null
  } else if (name === 'indexBk') {
    return val !== '' && val !== null && val !== undefined ? store.state.downAction + '?id=' + val : null
  } else if (name === 'imageA') {
    return val !== '' && val !== null && val !== undefined ? store.state.downAction + '?id=' + val : null
  } else if (name === 'imageB') {
    return val !== '' && val !== null && val !== undefined ? store.state.downAction + '?id=' + val : null
  }
}
