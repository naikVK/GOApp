import MQL from '@/plugins/mql.js'
import Configs from './Configs'
import FileDownloader from './FileDownloader'
export default class TemplateDownload {
  constructor(client) {
    this.client = client
    this.templateList = JSON.parse(
      JSON.stringify(window.app.$store.getters.templateList)
    )
    if (this.templateList == null) {
      this.templateList = []
    }
  }

  /**
     *
     * @param {(index: number,noOfDownloads:number,downloadPercent:number)=>{}} callback Updates when progress change.
     */
  onProgressUpdate (callback) {
    this.onProgressChange = callback
  }

  start () {
    return new Promise((successCallback, failedCallback) => {
      if (typeof cordova === 'undefined') {
        successCallback()
        return
      }
      // register callbacks to global
      this.successCallback = successCallback
      this.failedCallback = failedCallback

      this.checkPermissions().then(() => {
        this.fetchNewOrUpdatedTemplates()
      }).catch(err => {
        failedCallback(err)
      })
    })
  }

  getTemplatesRootBasePath () {
    return '/templates/'
  }

  getTemplatesRootPath () {
    let rootPath = this.getFileSystem()
    return rootPath +
      this.getTemplatesRootBasePath()
  }

  fetchNewOrUpdatedTemplates () {
    new MQL()
      // .setCustomURL("https://mepcs.mkcl.org/1LUEW7fJDMkpbkkdeyP9xlAjKmu/")
      .setActivity('o.[GetUpdatedTemplateMetaFilesList]')
      .setData({
        client: this.client,
        templates: this.templateList
      })
      .fetch()
      .then(rs => {
        if (rs.isValid('GetUpdatedTemplateMetaFilesList')) {
          let res = rs.getActivity('GetUpdatedTemplateMetaFilesList', true)
          let newOrUpdatedTemplateList = res.result
          if (newOrUpdatedTemplateList.length === 0) {
            // No new/updated templates found
            this.successCallback()
            return
          }

          // Some new/updated templates found, need to download
          this.startDownloadingTemplate(newOrUpdatedTemplateList, 0)
        } else {
          rs.showErrorToast('GetUpdatedTemplateMetaFilesList')
          this.failedCallback()
        }
      })
      .catch(() => {
        this.failedCallback('NETWORK_ERROR')
      })
  }

  getFileSystem () {
    return cordova.file.dataDirectory
  }

  startDownloadingTemplate (newOrUpdatedTemplateList, templateIndex) {
    if (templateIndex >= newOrUpdatedTemplateList.length) {
      this.successCallback()

      // save template list to db
      Configs.saveTemplateList(JSON.parse(JSON.stringify(this.templateList)))
      return
    }

    let downloadUrl = newOrUpdatedTemplateList[templateIndex].path
    if (window.app.$store.getters.classroomMode === 'offline') {
      downloadUrl = downloadUrl.replace('localhost', window.app.$store.getters.serverIP)
    }

    // extract parent path for directory creation
    let pathParts = downloadUrl.split('/')
    let fileName = pathParts.pop()

    let downloadLocation =
      this.getTemplatesRootPath() +
      '/' +
      fileName

    // create parent directory recursively
    Configs.createDirectoryRecursively(
      this.getFileSystem(),
      this.getTemplatesRootBasePath(),
      () => {
        // initialize downloader
        let downloader = new FileDownloader()

        // directory created and now start downloading
        downloader.start(
          downloadUrl,
          downloadLocation,
          progress => {
            // shows progress
            if (this.onProgressChange === undefined) {
              return
            }
            this.onProgressChange(templateIndex, newOrUpdatedTemplateList.length, progress)
          },
          () => {
            // update template list with new hash or insert new
            this.updateTemplateHash(newOrUpdatedTemplateList[templateIndex])

            // template download success and go for next template
            this.startDownloadingTemplate(
              newOrUpdatedTemplateList,
              templateIndex + 1
            )
          },
          err => {
            this.failedCallback(err)
          }
        )
      },
      err => {
        this.failedCallback(err)
      }
    )
  }

  updateTemplateHash (template) {
    let fileIndex = this.templateList.findIndex(element => {
      return element.path === template.path
    })

    if (fileIndex === -1) {
      // new template found and adding to template list
      this.templateList.push(template)
      return
    }

    this.templateList[fileIndex].hash = template.hash
  }

  checkPermissions () {
    return new Promise((resolve, reject) => {
      // required storage permission
      let requiredPermission = cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE
      cordova.plugins.permissions.checkPermission(requiredPermission, (status) => {
        if (status.hasPermission) {
          resolve()
        } else {
          cordova.plugins.permissions.requestPermission(requiredPermission, (status) => {
            if (!status.hasPermission) {
              reject('Permission denied.')
              return
            }
            resolve()
          }, () => {
            reject('Permission denied.')
          })
        }
      }, () => {
        reject('Permission denied.')
      })
    })
  }

  static commonDownload (clientName, onTemplateDownloadProgressCallback) {
    return new Promise((resolve, reject) => {
      commonTemplateDownloadProgressListener = onTemplateDownloadProgressCallback
      commonTemplateDownloadSuccessListener = resolve
      commonTemplateDownloadFailureListener = reject

      if (typeof cordova === 'undefined') {
        resolve()
        return
      }

      if (commonTemplateDownload) {
        // downloading is running
        return
      }
      commonTemplateDownload = new TemplateDownload(clientName)
      commonTemplateDownload.onProgressUpdate((index, count, percent) => {
        if (commonTemplateDownloadProgressListener) {
          commonTemplateDownloadProgressListener(index, count, percent)
        }
      })
      commonTemplateDownload
        .start()
        .then(() => {
          if (commonTemplateDownloadSuccessListener) {
            commonTemplateDownloadSuccessListener(commonTemplateDownload.getTemplatesRootPath())
          }
          TemplateDownload.resetCommonDownload()
        })
        .catch(err => {
          if (commonTemplateDownloadFailureListener) {
            commonTemplateDownloadFailureListener(err)
          }
          TemplateDownload.resetCommonDownload()
        })
    })
  }

  static resetCommonDownload () {
    commonTemplateDownload = null
    commonTemplateDownloadProgressListener = null
    commonTemplateDownloadSuccessListener = null
    commonTemplateDownloadFailureListener = null
  }
}

var commonTemplateDownload = new TemplateDownload('')
commonTemplateDownload = null
var commonTemplateDownloadProgressListener = null
var commonTemplateDownloadSuccessListener = null
var commonTemplateDownloadFailureListener = null
