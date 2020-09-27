import vue from 'vue'
const setItem = async (key, value) => {
  await vue.$localforage.resources.setItem(key, value)
}
const getItem = async (key) => {
  let item = await vue.$localforage.resources.getItem(key)
  // console.log('VAL:', item)
  return item
}
const removeItem = async (key) => {
  await vue.$localforage.resources.removeItem(key)
}
const clear = async () => {
  await vue.$localforage.resources.clear()
}
const length = async () => {
  let length = await vue.$localforage.resources.length()
  return length
}
const getKeyById = async (keyIndex) => {
  let k = await vue.$localforage.resources.key(keyIndex)
  return k
}
const getKeys = async () => {
  let keys = await vue.$localforage.resources.keys()
  return keys
}

// export async function SetItem(key,value){
//     await vue.$localforage.setItem(key, value)
// }
// export async function GetItem(key){
//     let item=await vue.$localforage.getItem(key)
//     return item
// }
// export async function RemoveItem(key){
//     await vue.$localforage.removeItem(key)

// }

// export async function Length(){
//     let length = await vue.$localforage.length()
//     return length

// }
// export async function GetKeyById(keyIndex){
//     let k = await vue.$localforage.key(keyIndex)
//     return k

// }
// export async function GetKeys(){
//     let keys = await vue.$localforage.keys()
//     return keys
// }

export default {
  getItem,
  getKeyById,
  getKeys,
  clear,
  length,
  setItem,
  removeItem
}
