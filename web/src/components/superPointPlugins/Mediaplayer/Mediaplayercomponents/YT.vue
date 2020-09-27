<template>
  <div class="video-viewer">
    <youtube
      width="100%"
      height="100%"
      ref="youtube"
      :video-id="videoId"
      :player-vars="playerVars"
      @playing="playing"
      @ready="ready"
    />
  </div>
</template>

<script>
import { getIdFromUrl } from 'vue-youtube'
export default {
  props: {
    videourl: {
      type: String,
      default: ''
    },
    playerOptions: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      videoId: '',
      playerVars: {
        controls: 0,
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        loop: 1,
        disablekb: 0,
        fitParent: true
      }
    }
  },
  methods: {
    playVideo () {
      this.player.playVideo()
    },
    ready () {
      this.player.cueVideoById({ 'videoId': this.videoId,
        'startSeconds': this.playerOptions.startTime > 0 ? this.playerOptions.startTime : 0,
        'endSeconds': this.playerOptions.endTime > 0 ? this.playerOptions.endTime : '' })
    },
    playing () {
      console.debug(' we are watching!!!')
    },
    getId () {
      this.videoId = getIdFromUrl(this.videourl)
    },
    save () {
      this.getId()

      this.$emit('player', this.player)
    }

  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }

  },
  mounted () {
    this.getId()
    // console.log(this.$refs)
    this.$emit('player', this.$refs.youtube.player)
  }
}
</script>

<style lang="scss" scoped>
.form-input{
  padding: 3%;
  width: 500px;
  border-color:brown;
  font-size: 18px;
}
.btn-upload {
  padding:1px
}
iframe
{
 display: block;
 width: 100%;
 border: none;
 overflow-y: auto;
 overflow-x: hidden;
//  border-radius:20px!important;
//  border:20px solid red!important;
}
</style>
