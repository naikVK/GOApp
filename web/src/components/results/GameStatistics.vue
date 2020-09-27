<template>
  <div
    class="statisticsGame"
    v-if="gameData && currentComponent!=''"
  >
    <div v-if="pluginProperties.gameType==='WC' &&this.currentComponent!==''">
      <component
        :is="componentLoader"
        :stats-data="statsData"
      />
    </div>
    <div
      v-else
      class="statisticsGame-alt"
    >
      <div>
        <component
          :is="componentLoader"
          :stats-data="statsData"
          :game-data="gameData"
        />
        <!-- :datacollection="datacollection" -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameStatistics',
  computed: {
    componentLoader () {
      return () =>
        import(
          `@/components/results/Games/${this.pluginProperties.gameType}/${this.currentComponent}.vue`
        )
    }
  },
  props: {
    statsData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    gameData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pluginProperties: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      //   GAMETYPE: GAME_TYPES,
      currentComponent: ''
    }
  },
  methods: {
    INIT () {
      if (this.gameData.gameType === 'Rating') {
        // this.prepareData()
        this.currentComponent = 'RatingStats'
        return
      }
      this.checkWord().then(res => {
        if (res) {
          this.currentComponent = 'TilesStats'
        } else {
          this.currentComponent = this.pluginProperties.gameType + 'Stats'
        }
      })

      // this.currentComponent="TilesStats"
    },
    checkWord () {
      return new Promise(resolve => {
        let keys = Object.keys(this.statsData)
        for (let i = 0; i < keys.length; i++) {
          const element = keys[i]
          if (element.includes(' ')) {
            resolve(true)
            break
          }
        }
        resolve(false)
      })
    }
  },
  mounted () {
    this.INIT()
  }
}
</script>
