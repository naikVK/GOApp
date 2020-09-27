<template>
  <div>
    <!-- For game summary -->
    <div v-if="$route.name==='GameSummary'">
      <ul
        id="div-left"
        class="tile-holder"
        v-if="!viewAll"
      >
        <li
          v-for="(tile,index) in list.slice(0, 5)"
          :key="index"
          class="tile"
        >
          <i class="mdi mdi-comment-outline mr-2" />
          {{ tile[0] }}
        </li>
        <button
          class="btn btn-view"
          @click="viewMore"
        >
          {{ $t('TilesStats.view_all') }}
          <i class="mdi mdi-chevron-down" />
        </button>
      </ul>
      <ul
        id="div-left"
        class="tile-holder"
        v-else
      >
        <li
          v-for="(tile,index) in list"
          :key="index"
          class="tile"
        >
          <i class="mdi mdi-comment-outline mr-2" />
          {{ tile[0] }}
        </li>
      </ul>
    </div>
    <!-- Ends here -->

    <!-- In case of show stats after question displayed -->
    <div
      class="main-wrapper"
      v-if="$route.name==='PresentationSlide'"
    >
      <ul
        id="div-left"
        class="tile-holder"
        v-if="!viewAll"
      >
        <li
          v-for="(tile,index) in list.slice(0, 5)"
          :key="index"
          class="tile"
        >
          <i class="mdi mdi-comment-outline mr-2" />
          {{ tile[0] }}
        </li>
        <button
          class="btn btn-view"
          @click="viewMore"
        >
          {{ $t('TilesStats.view_all') }}
          <i class="mdi mdi-chevron-down" />
        </button>
      </ul>
      <ul
        id="div-left"
        class="tile-holder"
        v-else
      >
        <li
          v-for="(tile,index) in list"
          :key="index"
          class="tile"
        >
          <i class="mdi mdi-comment-outline mr-2" />
          {{ tile[0] }}
        </li>
      </ul>
    </div>
    <!-- Ends here -->
    <!-- <div>
        <ul
          id="div-middle"
          class="col-md-4"
        >
          <li
            v-for="(tile,index) in list[1]"
            :key="index"
            class="tile"
          >
            {{ tile[0] }}
          </li>
        </ul>
      </div> -->
    <!-- <div>
        <ul
          id="div-right"
          class="col-md-4"
        >
          <li
            v-for="(tile,index) in list[2]"
            :key="index"
            class="tile"
          >
            {{ tile[0] }}
          </li>
        </ul>
      </div> -->
  </div>
</template>
<script>
export default {
  props: {
    statsData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      colors: ['blue', 'green', 'orange', 'pink', 'violet'],
      randomValues: [],
      list: [],
      viewAll: false
    }
  },
  computed: {
    colorFilter () {
      // this.colors[Math.floor(Math.random() * 3)]
      return (this.colors[Math.floor(Math.random() * 3)])
    }
  },

  methods: {
    viewMore () {
      this.viewAll = true
    },
    // createList () {
      // let chunk_size = 3
      // let newlist = []
      // while (temp.length) {
      //   newlist.push(temp.splice(0, chunk_size))
      // }
      // let placeHolders = 3
      // let newlist = this.list.reduce((r, v, i) => {
      //   r[i % placeHolders] = r[i % placeHolders] || []
      //   r[i % placeHolders].push(v)
      //   return r
      // }, [])
      // let colList = this.randomValues.reduce((r, v, i) => {
      //   r[i % placeHolders] = r[i % placeHolders] || []
      //   r[i % placeHolders].push(v)
      //   return r
      // }, [])
      // this.randomValues = colList
      // this.list = newlist
    // },
    INIT () {
      return new Promise((resolve, reject) => {
        for (const key in this.statsData) {
          if (this.statsData.hasOwnProperty(key) && key !== 'totalResponses') {
            const element = this.statsData[key]
            let temp = []
            temp.push(key)
            temp.push(element)
            this.list.push(temp)
          }
        }
        let counter = 0
        this.list.forEach(() => {
          this.randomValues.push(this.colors[counter % 5])
          counter += 1
        })
        resolve(true)
      })
    },

    sortList (list) {
      list.sort(function (a, b) {
        if (a[1] === b[1]) {
          return 0
        } else {
          return a[1] > b[1] ? -1 : 1
        }
      })
    }
  },
  created () {
    this.INIT().then(() => {
      // this.createList()
      this.sortList(this.list)
    })
  }
}
</script>
