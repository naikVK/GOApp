class StoreDataOperation {
  constructor (index, slidePosition) {
    this.globalData = {}
    this.getQueryStringValue = (key) => {
      // return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'))
      return key
    }
    // this.index = this.getQueryStringValue('index')
    this.index = index
    // this.slidePosition = this.getQueryStringValue('slidePosition')
    this.slidePosition = slidePosition || 'current'
    // console.log('this.slidePosition', this.slidePosition)
    // console.log('index', this.index)
    this.getDataFromStoreByIndex = (index = this.index) => {
      return window.app.$store.getters.getSlideDataByIndex(index)
      //  JSON.parse(JSON.stringify(window.app.$store.getters.getSlideDataByIndex(index)))
    }
    this.setDataInStoreByIndex = (data = {}, index = this.index) => {
      return new Promise((resolve) => {
        let vm = this
        let tempData = {
          index: index,
          data: data
        }
        window.app.$store.dispatch('setDataByIndex', tempData).then(function (res) {
          vm.globalData = res
          resolve(vm.globalData)
        })
      })
    }
    this.getGUID = () => {
      return new Promise((resolve) => {
        window.app.$store.dispatch('getGuid').then(res => {
          resolve(res)
        })
      })
    }
    this.getData = () => {
      return this.getDataFromStoreByIndex(this.index)
    }
    this.setData = (data) => {
      return this.setDataInStoreByIndex(data, this.index)
    }
    this.submitResponse = (response) => {
      let tempData = {
        index: this.index,
        data: response
      }
      return window.app.$store.dispatch('submitResponse', tempData)
    }
    this.getQuestionResponseById = (id) => {
      return window.app.$store.getters.getQuestionResponseById(id)
    }
    this.getQuestionModel = () => {
      return new Promise((resolve) => {
        this.getGUID().then(res => {
          let question = {
            'questionId': res.id,
            'questionType': 'McSingle',
            'questionText': '',
            'questionMediaType': '',
            'questionMediaPath': '',
            'questionDisplayText': '',
            'questionDifficultyLevel': '',
            'questionInstruction': '',
            'optionsList': []
          }
          resolve(question)
        })
      })
    }
    this.getOptionModel = () => {
      return new Promise((resolve) => {
        this.getGUID().then(res => {
          let option = {
            'optionId': res.id,
            'optionSequenceNo': '',
            'optionText': '',
            'optionMediaType': '',
            'optionMediaPath': '',
            'isCorrectAnswer': false
          }
          resolve(option)
        })
      })
    }
    this.uploadFile = (file, name, elementId) => {
      // console.log('file', file)
      return new Promise((resolve) => {
        let data = {
          file: file,
          inputFileName: '',
          elementId: elementId
        }
        let ext = file.name.substr(
          file.name.lastIndexOf('.') + 1
        )
        if (!name) {
          this.getGUID().then(res => {
            data['inputFileName'] = res.id + '.' + ext
            window.app.$store.dispatch('uploadFile', data).then(res => {
              resolve(res)
            })
          })
        } else {
          data['inputFileName'] = name.substr(file.name.lastIndexOf('/') + 1)
          window.app.$store.dispatch('uploadFile', data).then(res => {
            resolve(res)
          })
        }
      })
    }
    this.downloadFile = (data) => {
      return new Promise((resolve) => {
        window.app.$store.dispatch('downloadFile', data).then(res => {
          resolve(res)
        })
      })
    }
    this.getMediaFileName = (slideIndex) => {
      return window.app.$store.getters.getMediaFilePrefix(slideIndex)
    }
    this.getCDNServerURL = () => {
      return window.app.$store.getters.getCDNServerURL
    }
    // this.getDataFromStoreByIndex(this.index).then(res => {
    //   this.globalData = res
    // })
    this.getCurrentSlideData = () => {
      return JSON.parse(JSON.stringify(window.app.$store.getters.getSlide(this.slidePosition).data))
    }
    this.getCurrentSlideExtendedData = () => {
      return JSON.parse(JSON.stringify(window.app.$store.getters.getSlide(this.slidePosition).extendedData))
    }
    this.setCurrentSlideData = (data) => {
      return window.app.$store.dispatch('setCurrentSlideData', data)
    }
    this.setCurrentSlideExtendedData = (data) => {
      return window.app.$store.dispatch('setCurrentSlideExtendedData', data)
    }
    this.getCurrentPresentationMetaData = () => {
      return window.app.$store.getters.getCurrentPresentationMetaData
    }
    this.getCurrentQuestionProperties = () => {
      return window.app.$store.getters.getSlideQuestionProperties(this.slidePosition)
    }
    this.getSharedData = () => {
      return window.app.$store.state.Slide.sharedData
    }
    this.setSharedData = (data) => {
      return window.app.$store.dispatch('setCurrentSlideSharedData', data)
    }
    this.getSlidePosition = (data) => {
      return this.slidePosition
    }
    this.getCurrentPluginProperties = () => {
      return window.app.$store.getters.getSlidePluginProperties(this.slidePosition)
    }
  }
}

export default StoreDataOperation
// window.StoreDataOperation = StoreDataOperation
