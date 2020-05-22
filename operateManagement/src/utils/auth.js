import { getStorage, setStorage, removeStorage } from './storage'
const key = 'Admin_User'
const keyNode = 'Admin_Node'  //栏目信息
const keyDict = 'Admin_Dict'  //码表数据
const keySite = 'Admin_SITE'    //站点信息
const keyPerm = 'Admin_Perm'    //站点信息

export function getUser () {
  return getStorage(key)
}

export function setUser (user) {
  return setStorage(key, user)
}

export function removeUser () {
  return removeStorage(key)
}

export function getNode () {
  return getStorage(keyNode)
}

export function setNode (node) {
  return setStorage(keyNode, node)
}

export function removeNode () {
  return removeStorage(keyNode)
}

export function getDict () {
  return getStorage(keyDict)
}

export function setDict (user) {
  return setStorage(keyDict, user)
}

export function removeDict () {
  return removeStorage(keyDict)
}
export function getSite () {
  return getStorage(keySite)
}

export function setSite (Site) {
  return setStorage(keySite, Site)
}

export function removeSite () {
  return removeStorage(keySite)
}
export function getPerm () {
  return getStorage(keyPerm)
}

export function setPerm (Perm) {
  return setStorage(keyPerm, Perm)
}

export function removePerm () {
  return removeStorage(keyPerm)
}