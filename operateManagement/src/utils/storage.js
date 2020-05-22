const secret = 'hstone'
const Storage = window.sessionStorage
export function setStorage (key,value) {
    Storage.setItem(`${secret}_${key}`,JSON.stringify(value))
}
export function getStorage (key){
    if(!key){
        return null
    }
    try {
        const realKey = `${secret}_${key}`
        return JSON.parse(Storage.getItem(realKey))
    } catch (err) {
        return null
    }
}
export function removeStorage (key) {
    if (key) {
        try {
            const realKey = `${secret}_${key}`
            Storage.removeItem(realKey)
        } catch (err) {

        }
    }
}