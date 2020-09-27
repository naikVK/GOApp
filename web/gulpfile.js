const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const fsExtra = require('fs-extra')
const request = require('request')
const readline = require('readline')
const readLineSync = require('readline-sync')

let genI18nConfig = null
let objToWrite = {}
let paths = {
  langFolder: path.join(__dirname, 'src/lang/'),
  srcFolder: path.join(__dirname, 'src/')
}

gulp.task('geni18n', function (done) {
  let projPath = paths.srcFolder
  fetchI18nConfig()
  readPrevi18n()
  backUpI18nFile()
  i18nGenerator(projPath, [genI18nConfig.langConfig.defaultLang], genI18nConfig.langConfig.defaultLang)
  // askToOverrideI18nFiles().then(overrideI18nFiles => {
  //   if (overrideI18nFiles) {
  //     console.log('Overriding i18n files...')
  //   }
  //   translateI18nFiles(projPath, overrideI18nFiles).catch(err => {
  //     console.error(err)
  //   }).finally(() => {
  //     done()
  //   })
  // })
  translateI18nFiles(projPath, false).catch(err => {
    console.error(err)
  }).finally(() => {
    done()
  })
})

gulp.task('geni18n-clean', function (done) {
  let projPath = paths.srcFolder
  fetchI18nConfig()
  backUpI18nFile()
  listOutFilesForCleaning(projPath).catch(err => {
    console.error(err)
  }).finally(() => {
    done()
  })
})

function listOutFilesForCleaning (projPath) {
  return new Promise((resolve, reject) => {
    let fileList = walkSync(projPath)
    let dafaultLangFile = JSON.parse(fs.readFileSync(projPath + 'lang/' + genI18nConfig.langConfig.defaultLang + '.json', 'utf8'))

    let unusedKeys = []
    Object.keys(dafaultLangFile).forEach(fileName => {
      let filesToSearched = fileList.filter(filePath => {
        return path.basename(filePath).split('.')[0] == fileName
      })
      if (typeof dafaultLangFile[fileName] === 'object') {
        unusedKeys = findUnusedKeysInFiles(unusedKeys, fileName, filesToSearched, Object.keys(dafaultLangFile[fileName]))
      }
    })

    if (unusedKeys.length == 0) {
      // nothing to cleanup
      console.info(unusedKeys.length + ' unused keys found.')
      resolve()
      return
    }

    console.info('Unused keys', unusedKeys)
    askToCleanUnusedKeysFromI18nFiles(unusedKeys.length).then(allowedToRemoveKeys => {
      if (allowedToRemoveKeys) {
        // remove unused keys from all i18n files
        removeUnusedKeysFromI18nFiles(projPath, unusedKeys)
      }
      resolve()
    })
  })
}

function removeUnusedKeysFromI18nFiles (projPath, unusedKeys) {
  let listOfI18nFiles = [genI18nConfig.langConfig.defaultLang]
  listOfI18nFiles.push(...genI18nConfig.langConfig.otherLangs)

  listOfI18nFiles.forEach(i18nFile => {
    let langJson = JSON.parse(fs.readFileSync(projPath + 'lang/' + i18nFile + '.json', 'utf8'))
    unusedKeys.forEach(unusedKey => {
      let keyParts = unusedKey.split('.')
      delete langJson[keyParts[0]][keyParts[1]]

      // checking for empty object
      if (Object.keys(langJson[keyParts[0]]).length == 0) {
        delete langJson[keyParts[0]]
      }
    })

    // write modified i18n file
    fs.writeFileSync(projPath + 'lang/' + i18nFile + '.json', JSON.stringify(langJson, null, 2))
    console.info('Changes made to', projPath + 'lang/' + i18nFile + '.json')
  })
}

function findUnusedKeysInFiles (unusedKeys, fileName, filesToSearched, keysToSearch) {
  let dataOfFilesToSearched = []
  filesToSearched.forEach(file => {
    dataOfFilesToSearched.push(fs.readFileSync(file, 'utf8'))
  })
  keysToSearch.forEach(key => {
    let keyToSearch = fileName + '.' + key
    let regStr = "'" + keyToSearch + "'|\"" + keyToSearch + '"'
    const regexWithKey = new RegExp(regStr, 'g')
    let keyIsUsed = false
    for (let index = 0; index < dataOfFilesToSearched.length; index++) {
      const dataToScanned = dataOfFilesToSearched[index]
      keyIsUsed = dataToScanned.match(regexWithKey) != null
      if (keyIsUsed) {
        break
      }
    }
    if (!keyIsUsed) {
      if (!unusedKeys.includes(keyToSearch)) {
        unusedKeys.push(keyToSearch)
      }
    }
  })
  return unusedKeys
}

function confirmFromConsole (message) {
  return new Promise((resolve, _) => {
    var rl = readline.createInterface(process.stdin, process.stdout)
    rl.question(message, (res) => {
      rl.close()
      resolve(res == 'y')
    })
  })
}

function askToOverrideI18nFiles () {
  // take permission to override i18n files
  return confirmFromConsole('Do you want to override existing i18n files? (y/n) ')
}

function askToCleanUnusedKeysFromI18nFiles (noOfUnusedKeys) {
  // take permission to remove unused keys from i18n files
  return confirmFromConsole(noOfUnusedKeys + ' unused key' + (noOfUnusedKeys > 1 ? 's' : '') + ' found.\nDo you want to remove ' + (noOfUnusedKeys > 1 ? 'these keys' : 'this key') + ' from i18n files? (y/n) ')
}

function fetchI18nConfig () {
  var packageJson = JSON.parse(fs.readFileSync('./package.json'))
  genI18nConfig = packageJson.genI18nConfig
}

function updateI18nConfig () {
  var packageJson = JSON.parse(fs.readFileSync('./package.json'))
  packageJson.genI18nConfig = genI18nConfig
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
  console.log('"genI18nConfig.token" updated in "package.json".')
}

function translateAPICall (data, callback) {
  request.post(genI18nConfig.url + '/r/mql', {
    headers: {
      'service-header': 'GetTranslatedI18n',
      'authorization': 'Bearer ' + genI18nConfig.token
    },
    json: data
  }, callback)
}

function getTokenForTranslateAPICall () {
  return new Promise((resolve, reject) => {
    if (genI18nConfig.token) {
      console.log('Authentication token is expired...')
    } else {
      console.log('Authentication token is needed for translation...')
    }
    confirmFromConsole('Do you want to login for getting authentication token? (y/n) ').then((res) => {
      if (!res) {
        resolve(false)
        return
      }
      let username = readLineSync.question('Username: ', { hideEchoBack: false })
      let password = readLineSync.question('Password: ', { hideEchoBack: true })
      request.post(genI18nConfig.url + '/o/mql', {
        headers: {
          'service-header': 'LoginSVC'
        },
        json: {
          'LoginSVC': {
            'loginId': username,
            'password': password,
            'companyId': genI18nConfig.companyId
          }
        }
      }, (err, res) => {
        if (err) {
          reject(err)
          return
        }

        if (res.statusCode != 200) {
          reject('Error: ' + res.statusMessage)
          return
        }

        let responseBody = res.body

        if (responseBody.LoginSVC.error) {
          reject('Error: ' + responseBody.LoginSVC.error)
          return
        }

        // get token from header
        genI18nConfig.token = res.headers.authorization

        // update package.json with new token
        updateI18nConfig()

        resolve(true)
      })
    })
  })
}

function translateI18nFiles (projPath, overrideI18nFiles) {
  return new Promise((resolve, reject) => {
    let dafaultLangFile = JSON.parse(fs.readFileSync(projPath + 'lang/' + genI18nConfig.langConfig.defaultLang + '.json', 'utf8'))
    translateAPICall({ 'GetTranslatedI18n': { 'langArr': genI18nConfig.langConfig.otherLangs, 'enJson': JSON.stringify(dafaultLangFile) } }, (err, res) => {
      if (err) {
        reject(err)
        return
      }

      if (res.statusCode == 412) {
        getTokenForTranslateAPICall().then((isNewTokenGenerated) => {
          if (!isNewTokenGenerated) {
            reject('Skipping translation...')
            return
          }

          // try again with new token
          translateI18nFiles(projPath, overrideI18nFiles).then(resolve).catch(reject)
        }).catch((err) => {
          reject(err)
        })
        return
      }

      if (res.statusCode != 200) {
        reject('Error: ' + res.statusMessage)
        return
      }

      let responseBody = res.body

      if (responseBody.GetTranslatedI18n.error) {
        reject('Error: ' + responseBody.GetTranslatedI18n.error)
        return
      }

      writeTranslatedI18nFiles(projPath, responseBody.GetTranslatedI18n.result, overrideI18nFiles)
      resolve()
    })
  })
}

function writeTranslatedI18nFiles (projPath, translatedResults, overrideI18nFiles) {
  for (let index = 0; index < translatedResults.length; index++) {
    const translatedFile = translatedResults[index]
    if (overrideI18nFiles) {
      fs.writeFileSync(projPath + 'lang/' + translatedFile.lang + '.json', JSON.stringify(translatedFile.json, null, 2))
      console.info('Changes made to', projPath + 'lang/' + translatedFile.lang + '.json')
    } else {
      writeNonExistingTranslatedKeysToI18nFiles(projPath, translatedFile)
    }
  }
}

function extractPathsFromObject (paths, obj, pathList) {
  Object.keys(obj).forEach(key => {
    let innerValue = obj[key]
    let isObject = typeof innerValue === 'object'
    if (isObject) {
      let tempPaths = JSON.parse(JSON.stringify(paths))
      tempPaths.push(key)
      pathList = extractPathsFromObject(tempPaths, innerValue, pathList)
    } else {
      let tempPaths = JSON.parse(JSON.stringify(paths))
      tempPaths.push(key)
      pathList.push(tempPaths.join('.'))
    }
  })
  return pathList
}

function objectPathsExtracter (obj) {
  return extractPathsFromObject([], obj, [])
}

function writeNonExistingTranslatedKeysToI18nFiles (projPath, translatedFile) {
  // read existing file contents
  let existingI18n = {}
  let isFileFound = true
  try {
    existingI18n = JSON.parse(fs.readFileSync(projPath + 'lang/' + translatedFile.lang + '.json', 'utf8'))
  } catch (err) {
    if (err.message.includes('no such file or directory')) {
      isFileFound = false
    } else {
      console.log(err.message)
      return
    }
  }

  if (!isFileFound) {
    // lang file not found, so writing new file
    fs.writeFileSync(projPath + 'lang/' + translatedFile.lang + '.json', JSON.stringify(translatedFile.json, null, 2))
    console.info('Created', projPath + 'lang/' + translatedFile.lang + '.json')
    return
  }

  let existingI18nPaths = objectPathsExtracter(existingI18n)
  let translatedI18nPath = objectPathsExtracter(translatedFile.json)

  // remove existing key from list
  let keysToBeUpdated = translatedI18nPath.filter(val => !existingI18nPaths.includes(val))

  keysToBeUpdated.forEach(newKey => {
    try {
      assignNewKey(existingI18n, newKey, getValueFromPath(translatedFile.json, newKey))
    } catch (_) { }
  })
  if (keysToBeUpdated.length > 0) {
    fs.writeFileSync(projPath + 'lang/' + translatedFile.lang + '.json', JSON.stringify(existingI18n, null, 2))
    console.info('Changes made to', projPath + 'lang/' + translatedFile.lang + '.json')
  } else {
    console.info('No changes made to', projPath + 'lang/' + translatedFile.lang + '.json')
  }
}

function getValueFromPath (obj, path) {
  for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
    obj = obj[path[i]]
  };
  return obj
}

function assignNewKey (obj, keyPath, value) {
  let keyPaths = keyPath.split('.')
  lastKeyIndex = keyPaths.length - 1
  for (var i = 0; i < lastKeyIndex; ++i) {
    key = keyPaths[i]
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[keyPaths[lastKeyIndex]] = value
}

function backUpI18nFile () {
  let d = new Date()
  let dformat = [paddingZero(d.getDate()), paddingZero(d.getMonth() + 1),
  paddingZero(d.getFullYear())].join('_') + '_' +
    [paddingZero(d.getHours()),
    paddingZero(d.getMinutes()),
    paddingZero(d.getSeconds()), paddingZero(d.getMilliseconds())].join('_')

  let backUpFolderPath = paths.langFolder + 'backup/' + dformat
  fsExtra.ensureDirSync(backUpFolderPath)

  let listOfI18nFiles = [genI18nConfig.langConfig.defaultLang]
  listOfI18nFiles.push(...genI18nConfig.langConfig.otherLangs)
  listOfI18nFiles.forEach(i18nFile => {
    let backUpFilePath = backUpFolderPath + '/' + i18nFile + '.json'
    try {
      fsExtra.ensureDirSync(backUpFolderPath)
    } catch (error) {
      console.log('Cannot create backup folder...')
    }
    let enFilePath = paths.langFolder + i18nFile + '.json'
    if (fs.existsSync(enFilePath)) {
      let content = fs.readFileSync(enFilePath, 'utf8')
      fs.writeFileSync(backUpFilePath, content)
    }
  })
}

function paddingZero (number) {
  if (number <= 9) {
    let temp = '0' + number.toString()
    return temp
  }
  return number.toString()
}

function createDvJson (projPath, objToWrite) {
  for (let key in objToWrite) {
    if (typeof objToWrite[key] === 'object') {
      let temp = objToWrite[key]
      for (let newKey in temp) {
        if (temp.hasOwnProperty(newKey)) {
          temp[newKey] = newKey
        }
      }
    }
  }
  let dvFilePath = paths.langFolder + 'dv.json'
  fs.writeFileSync(dvFilePath, JSON.stringify(objToWrite, null, 2))
}

function readPrevi18n () {
  let enFilePath = paths.langFolder + genI18nConfig.langConfig.defaultLang + '.json'
  try {
    fs.accessSync(enFilePath, fs.R_OK | fs.W_OK)
    let content = fs.readFileSync(enFilePath, 'utf8')
    objToWrite = JSON.parse(content)
  } catch (e) {
    console.log(genI18nConfig.langConfig.defaultLang + '.json file is missing...')
    fsExtra.ensureFileSync(enFilePath)
    console.log('Created ' + genI18nConfig.langConfig.defaultLang + '.json file...')
    objToWrite = {}
  }
}

function i18nGenerator (projPath, langArray, defaultLanguage) {
  let fileList = walkSync(projPath)
  let flag = 0
  let i
  let len = fileList.length
  let regexString = `([$]t[(]('|")##(.+?)##)(\\s*\\s*)(@@([\\s\\S]*?)@@('|")[)])`
  let regex = new RegExp(regexString, 'gi')

  if (fileList != null && fileList !== undefined && fileList.length > 0) {
    for (i = 0; i < fileList.length; i++) {
      flag++
      if (flag === len) {
        let fileList = walkSync(projPath)
        let i; let len = fileList.length
        if (fileList !== null && fileList !== undefined && fileList.length > 0) {
          for (i = 0; i < len; i++) {
            let file = fileList[i]
            let keyPrefix = path.basename(file).split('.')[0]
            let content = fs.readFileSync(file, 'utf8')
            let i18nContentsToBeReplaced = content.match(regex)
            let translatedAdded = content
            if (i18nContentsToBeReplaced != null && i18nContentsToBeReplaced !== '' && i18nContentsToBeReplaced !== undefined && i18nContentsToBeReplaced.length > 0) {
              for (let j = 0; j < i18nContentsToBeReplaced.length; j++) {
                let extractKeyFrom = i18nContentsToBeReplaced[j].toString()
                let key = extractKeyFrom.substring(extractKeyFrom.indexOf('##') + 2, extractKeyFrom.lastIndexOf('##')).trim()
                let value = extractKeyFrom.substring(extractKeyFrom.indexOf('@@') + 2, extractKeyFrom.lastIndexOf('@@')).trim()
                // let replacement = "{{'" + key + "' | translate}}";
                let replacement = "$t('" + keyPrefix + '.' + key + "')"
                // console.log('keyPrefix + key', keyPrefix, key)
                translatedAdded = translatedAdded.replace(extractKeyFrom, replacement)
                prepareI18nObject(keyPrefix, key, value)
              }
              fs.writeFileSync(file, translatedAdded)
            }
            if (i === (len - 1)) {
              console.log('\n\n')
              console.log('Internationalization successfully done on ' + (i + 1) + ' files')
              console.log('\n\n')
              let enFilePath = paths.langFolder + genI18nConfig.langConfig.defaultLang + '.json'
              fs.writeFileSync(enFilePath, JSON.stringify(objToWrite, null, 2))
              createDvJson(projPath, objToWrite)
            }
          }
        }
      }
    }
  }
}

function isAllowedForScan (ext) {
  return genI18nConfig.scanFiles.includes(ext)
}

let walkSync = function (dir, filelist) {
  let files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist)
    } else {
      if (isAllowedForScan(path.extname(file))) {
        filelist.push(dir + file)
      }
    }
  })
  return filelist
}

function prepareI18nObject (keyPrefix, key, value) {
  if (!objToWrite.hasOwnProperty(keyPrefix)) {
    objToWrite[keyPrefix] = {}
  }
  let parentObj = objToWrite[keyPrefix]
  parentObj[key] = value
}
