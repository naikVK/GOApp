<template>
  <div
    id="questionSection"
    v-if="questionExtendedData && questionExtendedData.questionStaticData"
  >
    <p v-if="mediaType==='Text' && showText">
      {{ questionName }}
    </p>
    <div
      v-if="mediaType==='Image'"
      class="image-qt-wrapper"
    >
      <img
        :src="preparePath(questionExtendedData.questionStaticData.questionDetails['questionInMediaImagePathTf'])"
        alt="sample image"
        class="img-fluid question-img"
        @click="togglelightBox"
      >
      <!-- height="300px" -->
      <!-- width="300px" -->
      <p
        v-if="showText"
        class="question-data"
      >
        {{ questionName }}
      </p>
      </object>
    </div>
    <div
      class="lightbox-wrapper"
    >
      <div
        class="lightbox-wrapper__media"
        :class="[lightboxFlag === true ? 'active' : '']"
      >
        <div class="lightbox-wrapper__media-content">
          <button
            class="close"
            @click="lightboxFlag = false"
          >
            <span class="icon-close">&times;</span>
          </button>
          <img
            :src="preparePath(questionExtendedData.questionStaticData.questionDetails['questionInMediaImagePathTf'])"
            alt="question image"
            class="lightbox-wrapper__media-content-img"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import idb from '@/plugins/idb'
export default {
  props: {

    questionData: {
      type: Object,
      default: () => {
        return {}
      }
    },

    questionExtendedData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      questionName: '',
      lightboxFlag: false,
      showText: false,
      mediaType: 'Text',
      imgurl: ''
      //   questionData: {},
      //   questionExtendedData: {}

    }
  },
  components: {
  },
  methods: {
    togglelightBox () {
      this.lightboxFlag = !this.lightboxFlag
    },
    replaceBuckets (questionText, buckets) {
      // let questionText = this.questionExtendedData.questionStaticData.questionDetails['questionTextTf']
      // let questionInMediaImageTextTf = this.questionExtendedData.questionStaticData.questionDetails['questionInMediaImageTextTf']

      buckets.forEach(bucketName => {
        let bucketIds = ''
        for (var key in this.questionExtendedData.questionStaticData.questionDetails) {
          if (this.questionExtendedData.questionStaticData.questionDetails[key] === bucketName.split('#')[1]) {
            if (key.includes('optionBucketName')) {
              let temp = key.split('_')
              bucketIds = temp[1]
              let opt = this.findBucketOptions(bucketIds)
              // randomly choose bucket options to replace
              // if (questionText != '') {
              // }
              // if (questionInMediaImageTextTf) {
              //   questionInMediaImageTextTf = questionInMediaImageTextTf.replace(bucketName, this.questionExtendedData.questionStaticData.questionDetails['optMediaImageTextTf_' + opt[0].optionIdOpt])
              //   this.questionInMediaImageTextTf = questionInMediaImageTextTf
              // }
              switch (this.mediaType) {
                case 'Text':

                  questionText = questionText.replace(bucketName, this.questionExtendedData.questionStaticData.questionDetails['optTextTf_' + opt[0].optionIdOpt])
                  this.questionName = questionText
                  break
                case 'Image':
                  questionText = questionText.replace(bucketName, this.questionExtendedData.questionStaticData.questionDetails['optMediaImageTextTf_' + opt[0].optionIdOpt])
                  this.questionName = questionText
                  break

                case 'Audio':
                  questionText = questionText.replace(bucketName, this.questionExtendedData.questionStaticData.questionDetails['optMediaAudioTextTf_' + opt[0].optionIdOpt])
                  this.questionName = questionText
                  break

                case 'Video':
                  questionText = questionText.replace(bucketName, this.questionExtendedData.questionStaticData.questionDetails['optMediaVideoTextTf_' + opt[0].optionIdOpt])
                  this.questionName = questionText
                  break

                default:
                  break
              }
            }
          }
        }
      })

      this.showText = true
    },
    findBucketOptions (bucketId) {
      let optIds = []
      let bucketDetails = this.questionExtendedData.questionLogicalData.questionDetails.optionBucketDetails
      bucketDetails.forEach(singleBucket => {
        if (singleBucket['optionBucketId'] === bucketId) {
          optIds = singleBucket['optionBucketList']
        }
      })
      return optIds
    },
    initBuckets (questionText) {
      let buckets = []
      let temp = questionText.split(' ')
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].match(/#[a-zA-z]*/g) !== null) {
          buckets.push(temp[i].match(/#[a-zA-z]*/g)[0])
        }
      }

      this.replaceBuckets(questionText, buckets)
    },
    INIT () {
      this.mediaType = this.questionExtendedData.questionLogicalData.questionDetails.questionMediaType
      // eslint-disable-next-line no-unused-vars
      var questionText = ''
      switch (this.mediaType) {
        case 'Text':
          let questionText = this.questionExtendedData.questionStaticData.questionDetails['questionTextTf']
          this.initBuckets(questionText)
          break
        case 'Image':
          questionText = this.questionExtendedData.questionStaticData.questionDetails['questionInMediaImageTextTf']
          this.initBuckets(questionText)
          break
        case 'Audio':
          questionText = this.questionExtendedData.questionStaticData.questionDetails['questionInMediaAudioTextTf']
          this.initBuckets(questionText)
          break
        case 'Video':
          questionText = this.questionExtendedData.questionStaticData.questionDetails['questionInMediaVideoTextTf']
          this.initBuckets(questionText)
          break
        default:
          break
      }
      // if (questionText != '') {
      // }
      // if (questionInMediaImageTextTf) {
      //   this.initBuckets(questionInMediaImageTextTf)
      // }
    },
    preparePath (path) {
      // TODO : add base path of server
      let basePath = ''
      // idb.getItem(path).then(res => {
      //   if (res) {
      //     return res
      //   } else {
      //     this.setDataToIDB(path).then(res => {
      //       return res
      //     })
      //   }
      // })
      return basePath + path
    },
    renderIMG () {
      let imgs = document.getElementById('questionSection').getElementsByTagName('img')

      const observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // image.removeAttribute('href')
            let image = entry.target

            this.imgurl = image.src

            image.src = image.dataset.src
            let temp = image
            // let self = this
            // let imgtarget = img.target
            idb.getItem(this.imgurl).then(data => {
              if (data) {
                temp.src = data

                observer.unobserve(entry.target)
              } else {
                 if (!this.imgurl.includes('undefined')) {
                this.setDataToIDB(this.imgurl).then(newdata => {
                  data = newdata
                  temp.src = data

                  observer.unobserve(entry.target)
                })
                 }
              }
              // self.showImg = true

              // img.target.children[tags].children[childtag].setAttribute('xlink:href', data)
            })
            // observer.unobserve(imgtarget)

            // img.target.load()
          }
        })
      })
      for (let i = 0; i < imgs.length; i++) {
        // const element = imgs[i];

        observer.observe(imgs[i])
      }
    },
    setDataToIDB (url) {
      // eslint-disable-next-line promise/param-names
      return new Promise((resolve, _) => {
        this.toDataURL(url).then(res => {
          idb.setItem(url, res)
          resolve(res)
        })
      })
    },
    toDataURL (url) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.onload = function () {
          var reader = new FileReader()
          reader.onloadend = function () {
            resolve(reader.result)
          }
          reader.readAsDataURL(xhr.response)
        }
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.send()
        // idbaxios({
        //   url: url,
        //   method: 'GET',
        //   responseType: 'blob'
        // }).then(res => {

        //   var reader = new FileReader()
        //   reader.readAsDataURL(res.data)

        //   resolve(reader.result)
        // })
        // axios.get('/assetfdb/' + url).then(res => {
        //   resolve(res)
        // })
      })
    }
  },
  mounted () {
    this.INIT()
    this.$nextTick(() => {
      this.renderIMG()
    })
  }

}
</script>

<style lang="scss">
</style>
