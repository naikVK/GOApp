<template>
  <!-- <section class="view-only" v-if="properties.media">
       <iframe id="webviewHolder" v-bind:src="properties.media.value" target="self" height="400px" width="100%"></iframe>
    </section> -->
  <!-- <div
    v-if="render"
    class="video-viewer"
  >
    <div id="iframe-section">
    </div>
  </div> -->
  <section
    id="view"
    class="video-viewer"
  />
</template>

<script>
// import storeDataOperation from '@/../public/tempfiles/sampleSlides'
import StoreDataOperation from '@/plugins/StoreDataOperation.js'
let storeDataOperation
export default {
  props: {
    slidePosition: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  components: {
  },
  data: () => {
    return {
      properties: {},
      render: true

    }
  },
  methods: {
    // playVid () {
    //   switch (this.properties.media.source) {
    //     case this.sources.youtube:
    //       this.player.playVideo()
    //       break
    //     case this.sources.streamServer:
    //       let vid = document.getElementById('videoElemId')
    //       vid.play()
    //       break

    //     default:
    //       break
    //   }
    // },
    // pauseVid () {
    //   switch (this.properties.media.source) {
    //     case this.sources.youtube:
    //       this.player.pauseVideo()
    //       break
    //     case this.sources.streamServer:
    //       let vid = document.getElementById('videoElemId')
    //       vid.pause()
    //       break

    //     default:
    //       break
    //   }
    // },
    // loadVid () {
    //   switch (this.properties.media.source) {
    //     case this.sources.youtube:

    //       break
    //     case this.sources.streamServer:
    //       let vid = document.getElementById('videoElemId')
    //       vid.load()
    //       break

    //     default:
    //       break
    //   }
    // },
    INIT () {
      this.properties = storeDataOperation.getCurrentSlideData()
      if (this.properties && this.properties.embed && this.properties.embed.iframe) {
        let section = document.getElementById('view')
        section.innerHTML = this.properties.embed.iframe
        let iframe = document.querySelector('iframe')
        iframe.setAttribute('width', '100%')
        // console.log(iframe)
        this.render = true
        // this.videoURL = storeDataOperation.getCDNBaseURL() + this.properties.media.value
        // idb.getItem(this.properties.media.value).then(res => {
        //   if (res) {
        //     this.videoURL = res
        //     this.loadVid()
        //   } else {
        //     this.setDataToIDB(this.properties.media.value).then(res => {
        //       this.videoURL = res
        //       this.loadVid()
        //     })
        //   }
        // })
      }
    }

    // watchSharedData () {
    //   let self = this
    //   self.unwatch = window.parent.app.$store.watch(
    //     function (state) {
    //       return state.Slide.sharedData
    //     },
    //     function () {
    //       if (!window.parent) {
    //         self.unwatch()
    //         return
    //       }
    //       self.$set(self, 'sharedData', storeDataOperation.getSharedData())
    //       let temp = storeDataOperation.getSharedData()

    //       if (temp.sharedData.videoStatus === 'play') {
    //         self.playVid()
    //       } else if (temp.sharedData.videoStatus === 'pause') {
    //         self.pauseVid()
    //       }
    //     },
    //     {
    //       deep: true // add this if u need to watch object properties change etc.
    //     }
    //   )
    // },
    // getControl (player) {
    //   this.player = player
    //   // setTimeout(() => {
    //   //   this.playVid()
    //   // }, 2000)
    //   // setTimeout(() => {
    //   //   this.pauseVid()
    //   // }, 5000)
    // }
  },
  mounted () {
    storeDataOperation = new StoreDataOperation(this.index, this.slidePosition)
    this.INIT()
  },
  created () {
    // this.watchSharedData()
  }
}
</script>

<style lang="scss">
iframe
{
 display: block;
 width: 100%;
 border: none;
 overflow-y: auto;
 overflow-x: hidden;
}
iframe {
  margin: 0px;
  padding: 0px;
  height: 100%;
  border: none;
}
iframe {
  display: block;
  width: 100%;
  border: none;
  overflow-y: auto;
  overflow-x: hidden;
}
// .video-viewer {height: 100vh; }
</style>
