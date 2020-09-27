<template>
  <div
    id="questionSection"
    v-if="questionExtendedData && questionExtendedData.questionStaticData"
  >
    <!-- TODO: Display Text/Media with Configuration -->
    <!-- REVIEW: CONDITION:If Text Type -->
    <p
      v-if="mediaType==='Text'"
      class="question-data"
    >
      {{ questionExtendedData.questionStaticData.questionDetails.questionTextMcq }}
    </p>

    <!-- v-if="questionType=='image'" -->
    <div
      class="image-qt-wrapper"
      v-if="mediaType==='Image'"
    >
      <img
        :src="preparePath(questionExtendedData.questionStaticData.questionDetails.questionInMediaImagePathMcq)"
        alt="Sample image"
        class="img-fluid question-img"
        @click="togglelightBox"
      >
      <div
        v-if="questionExtendedData.questionStaticData.questionDetails.questionInMediaImageTextMcq"
        class="row align-items-center"
      >
        <div class="col-12">
          <p class="question-data">
            {{ questionExtendedData.questionStaticData.questionDetails.questionInMediaImageTextMcq }}
          </p>
        </div>
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
              :src="preparePath(questionExtendedData.questionStaticData.questionDetails.questionInMediaImagePathMcq)"
              alt="question image"
              class="lightbox-wrapper__media-content-img"
            >
          </div>
        </div>
      </div>
    </div>
    <!-- Ends here -->
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
      lightboxFlag: false,
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
    preparePath (path) {
      // TODO : add base path of server
      let basePath = ''

      // let urlist = path.split('CollegeDB')
      // path = 'CollegeDB' + urlist[1]

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
    this.mediaType = this.questionExtendedData.questionLogicalData.questionDetails.questionMediaType
    this.$nextTick(() => {
      this.renderIMG()
    })
  }

}
</script>

<style lang="scss">
</style>
