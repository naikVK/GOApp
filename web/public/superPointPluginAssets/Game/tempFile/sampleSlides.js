const gameData = {
  presenterText: 'Speak Up',
  responseType: 'word' // word or sentence
}
const gameProperties = {
  'gameType': 'WC',
  'templateText': 'Word Cloud'
}
// const getCurrentGameProperties = () => {
//   return gameProperties
// }
const getCurrentSlideData = () => {
  return gameData
}
const getCurrentPluginProperties = () => {
  return gameProperties
}
export default {
  gameData,
  gameProperties,
  getCurrentSlideData,
  // getCurrentGameProperties,
  getCurrentPluginProperties
}
