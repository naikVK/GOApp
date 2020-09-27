<template>
  <!-- <section class="view-only" v-if="properties.media.value">
       <iframe id="webviewHolder" v-bind:src="properties.media.value" target="self" height="400px" width="100%"></iframe>
    </section> -->
  <div>
    <div
      v-if="properties.media && properties.media.source===sources.streamServer"
      class="mediaPlayerVideo"
    >
      <div class="in-middle">
        <h1 class="title">
          {{ $t('MediaplayerPresentation.video') }}
        </h1>
        <div v-if="isCurrentSlide">
          <button
            v-if="videoStatus === 'pause'"
            @click="setVideoStatus('play')"
            class="btn"
          >
            <!-- Play -->
            <img
              src="../../../../public/superPointPluginAssets/MediaPlayer/play.png"
              class="icon-play"
            >
          </button>
          <button
            v-if="videoStatus === 'play'"
            @click="setVideoStatus('pause')"
            class="btn"
          >
            <!-- Pause -->
            <img
              src="../../../../public/superPointPluginAssets/MediaPlayer/pause.png"
              class="icon-pause"
            >
          </button>
        </div>
        <!-- // put button -->
      </div>
    </div>
    <you-tube
      v-if="properties.media && properties.media.source===sources.youtube"
      :videourl="properties.media.value"
      :player-options="properties.media.playerOptions"
      @playing="setVideoStatus('play')"
      @pause="setVideoStatus('pause')"
    />
    <!-- @player="getControl" -->
  </div>
</template>

<script>
import StoreDataOperation from '@/plugins/StoreDataOperation.js'
import { MediaSources } from '../../../utils/Constants'
import YouTube from './Mediaplayercomponents/YT'
let storeDataOperation
export default {
  components: {
    YouTube
  },
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
  data: () => {
    return {
      properties: {},
      videoStatus: 'pause',
      isCurrentSlide: false,
      sources: MediaSources
    }
  },
  methods: {
    setVideoStatus (status) {
      this.videoStatus = status
      storeDataOperation.setSharedData({ 'videoStatus': status })
    },
    INIT () {
      if (storeDataOperation.getSlidePosition() === 'current') {
        this.isCurrentSlide = true
      }
      this.properties = storeDataOperation.getCurrentSlideData()
    },
    watchSharedData () {
      let self = this
      self.unwatch = window.parent.app.$store.watch(
        function (state) {
          return state.Slide.sharedData
        },
        function () {
          if (!window.parent) {
            self.unwatch()
            return
          }
          self.$set(self, 'sharedData', storeDataOperation.getSharedData())
        },
        {
          deep: true // add this if u need to watch object properties change etc.
        }
      )
    }
  },
  mounted () {
    storeDataOperation = new StoreDataOperation(this.index, this.slidePosition)
    this.INIT()
  }
  // created () {
  //   this.watchSharedData()
  // },
  // beforeDestroy () {
  //   this.unwatch()
  // }
}
</script>

<style lang="scss">
.mediaPlayerVideo{
  * {margin: 0}

  .in-middle {height: 100vh; display: flex; align-items: center; justify-content: center; color: #333; flex-direction:  column;
  .title {
    font-size: 24px;
  }}
  .icon-play, .icon-pause {width: 44px; height: 44px;}
  .btn {
    background: transparent;
    border: 1px solid #ccc;
    padding: 10px;
    cursor: pointer;
  }
}

</style>
