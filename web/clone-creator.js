const fs = require('fs')
const CONFIG_KEY = 'cloneCreatorConfig'

class CloneCreator {

  init() {
    let packageJson = this.getConfigs()

    if (!packageJson.hasOwnProperty(CONFIG_KEY)) {
      console.error('ERROR: Clone creator configs missing in', 'package.json', '.')
      return
    }
    if (!Array.isArray(packageJson[CONFIG_KEY])) {
      console.error('ERROR: Invalid clone creator configs found in', 'package.json', '.')
      return
    }

    packageJson[CONFIG_KEY].forEach((configs) => {
      this.create(configs)
    })
  }

  getConfigs() {
    const configBuffer = fs.readFileSync('package.json')
    const configs = JSON.parse(configBuffer.toString())
    return configs
  }

  updateValues(data, newValue) {
    Object.keys(newValue).forEach((key) => {
      let value = newValue[key]
      if (typeof value == 'object') {
        if (!data.hasOwnProperty(key)) {
          data[key] = {}
        }
        data[key] = this.updateValues(data[key], value)
      } else {
        data[key] = value
      }
    })
    return data
  }

  create(configs) {
    let fileDataBuffer = fs.readFileSync(configs.srcFilePath)
    let fileData = JSON.parse(fileDataBuffer.toString())

    fileData = this.updateValues(fileData, configs.changes)

    fs.writeFileSync(configs.dstFilePath, JSON.stringify(fileData, null, 2))
    console.info('File clone created at', configs.dstFilePath, '.')
  }
}

new CloneCreator().init()