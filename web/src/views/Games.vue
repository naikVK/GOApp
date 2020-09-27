<template>
  <div>
    <TopMenu title="Games" />
    <div class="presentation-name mb-4">
      <!-- <span
      v-b-tooltip.hover
      :title="'This presentation is about '+ presentationData.description"
      >{{ presentationData.name || 'Topic Name' }}</span>-->
      <div>
        <i class="mdi mdi-theater" />
      </div>
      <div>
        <div class="ppt-name">
          {{ presentationData.name || 'Topic Name' }}
        </div>
        <!-- <div
      class="topic-name"
      v-b-tooltip.hover
      :title="'Topic name'"
    >
      {{ presentationData.paperDetails.name }}
        </div>-->
        <div class="topic-name">
          {{ presentationData.paperDetails.name }}
        </div>
      </div>
    </div>
    <div class="ViewPresentation wrap-alt">
      <div v-if="gameList.length > 0 && !isLoading">
        <div
          v-for="(game, i1) in gameList"
          :key="i1"
          class="row mb-5"
        >
          <div class="col-md-5">
            <div class="word-cloud-holder">
              <p
                class="cloud-title"
                v-if="game.gameType=='WC'"
              >
                Q. {{ game.gameText }}
              </p>
              <p
                v-else
                class="cloud-title"
              >
                <span v-if="game.gameData.data && game.gameData.data.gameProperties">
                  <!-- {{ game.gameData.data.gameProperties }} -->
                  Q. {{ game.gameData.data.gameProperties.gameQuestion.questionDetails.questionText }}
                </span>
              </p>

              <div v-if="game.gameType=='WC'">
                <div v-if="game.isSentenceAllowed">
                  <tile-stats :stats-data="game.stats" />
                </div>
                <w-c-stats
                  v-else
                  :stats-data="game.stats"
                />
              </div>
              <div v-else>
                <RatingStats
                  :stats-data="game.stats"
                  :game-data="game.gameData.data"
                />
              </div>
            </div>
          </div>
          <span v-if="game.gameType=='WC'">
            <div class="offset-md-1 col-md-5">
              <!-- <p class="cloud-title mb-3">
              Q. {{ game.gameText }} ?
              </p>-->
              <div
                v-for="(word, i2) in game.responses"
                :key="i2"
                class="wc-wrapper"
              >
                <div class="sno">{{ i2 + 1 }}.</div>
                <div class="w-100">
                  <button
                    class="wc-trigger"
                    v-b-toggle="word.word"
                    @click="isCollapsed"
                  >
                    <p class="wc-summary-title mr-3">{{ word.word }}</p>
                    <p
                      class="wc-summary-count"
                      :class="iscollapse === true ? 'zoom' : ''"
                    >{{ word.learners.length }}</p>
                  </button>
                  <b-collapse
                    :id="word.word"
                    class="mt-1 student-list"
                  >
                    <ul class="list-holder">
                      <li
                        v-for="(learner, i3) in word.learners"
                        :key="i3"
                        class="list-item"
                      >
                        <i class="mdi mdi-account icon-student" />
                        {{ learner.basicInfo.fullName }}
                      </li>
                    </ul>
                  </b-collapse>
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
      <div
        class="col-12 empty-state"
        v-else-if="!isLoading"
      >
        <div class="title">
          {{ $t('Games.no_games_found') }}
        </div>
        <div class="sub-title">
          {{ $t('Games.games_were_not_in_the_presentation') }}
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center loader-box">
          <span v-if="isLoading">
            <i class="mdi mdi-spin mdi-chart-donut" />
            {{ $t('SelectSubject.please_wait') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from '../components/common/TopMenu'
import MQL from '@/plugins/mql.js'
import WCStats from '../components/results/Games/WC/WCStats.vue'
import TileStats from '../components/results/Games/WC/TilesStats.vue'
import RatingStats from '../components/results/Games/Rating/RatingStats.vue'
export default {
  data () {
    return {
      colors: ['#ef676e', '#41adce', '#8bc34a', '#4749a0', '#3f51b5'],
      iscollapse: false,
      runnableStats: {},
      runnableData: {},
      gameList: [],
      presentationData: this.$store.getters.getSummary,
      isLoading: true
    }
  },
  components: {
    WCStats,
    TileStats,
    TopMenu,
    RatingStats
  },
  methods: {
    isCollapsed () {
      this.iscollapse = !this.iscollapse
    },
    fetchGames () {
      return new Promise(resolve => {
        new MQL()
          .setActivity('r.[FetchRunnableStatsDataByPresentationCacheId]')
          .setData({
            presentationCacheId: this.$store.state.Slide.currentSummary
              .presentationCacheId
          })
          .fetch()
          .then(rs => {
            if (rs.isValid('FetchRunnableStatsDataByPresentationCacheId')) {
              let res = rs.getActivity(
                'FetchRunnableStatsDataByPresentationCacheId',
                true
              )
              // console.log(res.result)
              this.runnableStats = res.result[0]

              new MQL()
                .setActivity('r.[FetchRunnableDataByCacheId]')
                .setData({
                  presentationCacheId: this.$store.state.Slide.currentSummary
                    .presentationCacheId
                })
                .fetch()
                .then(rs => {
                  if (rs.isValid('FetchRunnableDataByCacheId')) {
                    let res = rs.getActivity(
                      'FetchRunnableDataByCacheId',
                      true
                    )
                    // console.log(res.result[0])
                    this.runnableData = res.result[0]
                    let slides = this.runnableData.slidesMetadata.filter(
                      slide => slide.slideType === 'gameTemplate'
                    )
                    slides.forEach(slide => {
                      if (this.runnableStats[slide.slideId].stats) {
                        let gameStats = this.runnableStats[slide.slideId]
                        // let newStats = []
                        // for (const key in gameStats) {
                        //   if (gameStats.hasOwnProperty(key) && key !== 'slideEndTime' && key !== 'slideStartTime' && key !== 'stats') {
                        //     const element = gameStats[key]
                        //     element.learners.forEach(learner => {
                        //       learner['answer'] = key
                        //       newStats.push(learner)
                        //     })
                        //   }
                        // }
                        let tempSlideData = this.runnableData.slides.find(
                          entry => entry.slideId === slide.slideId
                        )
                        gameStats['isSentenceAllowed'] =
                          tempSlideData.data.isSentenceAllowed
                        let responses = []
                        for (const key in this.runnableStats[slide.slideId]
                          .stats) {
                          if (
                            gameStats.hasOwnProperty(key) &&
                            key !== 'totalResponses'
                          ) {
                            const element = gameStats[key]
                            let obj = {}
                            obj['word'] = key
                            obj['learners'] = element.learners
                            responses.push(obj)
                          }
                        }
                        gameStats['responses'] = responses
                        // console.log('new stats:', newStats)
                        gameStats['slideId'] = slide.slideId
                        let gameData = this.runnableData.slides.find(
                          s => s.slideId === slide.slideId
                        )
                        gameStats['gameText'] = gameData.data.presenterText
                        // gameStats['learners'] = newStats
                        gameStats['gameData'] = gameData
                        this.gameList.push(gameStats)
                        this.isLoading = false
                      }
                    })
                  }
                })
            } else {
              this.isLoading = false
            }
          })
      })
    },
    prepareImgPath (imgPath) {
      let config = this.$store.getters.config
      return (
        'http://' +
        config.ipAddress +
        ':' +
        config.appPort +
        '/o/assetfdb/' +
        imgPath
      )
    }
  },
  mounted () {
    this.fetchGames()
  }
}
</script>

<style lang="scss">
.word-cloud {
  width: 100%;
  padding: 20px 30px;
}
.cloud-title {
  font-size: 17px;
  font-weight: 500;
  margin-top: 10px;
}

//------------------------------------------------------
// Word cloud stats
//------------------------------------------------------
.wc-wrapper {
  // padding-bottom: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  width: 100%;
  .sno {
    margin-right: 15px;
  }

  .wc-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: none;
    background-color: var(--bg-color-alt2);
    padding: 16px 24px;
    // box-shadow: 0 15px 25px rgba(#eee,  .35);
    border-radius: 5px;
    .wc-summary-title {
      text-align: left;
    }
    overflow: hidden;
    &:focus {
      outline: none;
    }
    .wc-summary {
      &-title {
        margin-bottom: 0;
        font-size: 17px;
      }
      &-count {
        margin-bottom: 0;
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #eee;
        transition: transform 0.4s ease-in-out;
        transform: scale(1);
        &.zoom {
          &::before {
            transition: transform 0.4s ease-in-out;
            transform: scale(2.4);
            border-radius: 0;
          }
        }
        &::before {
          content: "";
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 20%;
          background-color: #4749a0;
          z-index: -1;
          transition: transform 0.4s ease-in-out;
          transform: scale(1);
        }
        &.green {
          &::before {
            background-color: #8bc34a;
          }
        }
        &.blue {
          &::before {
            background-color: #1f83f6;
          }
        }
      }
    }
  }
  .student-list.collapse.show {
    transition: box-shadow 0.15s ease-in;
    box-shadow: 0 15px 25px rgba(#eee, 0.35);
    .list-holder {
      margin: 0;
      padding: 0 24px;
      list-style: none;
      background: var(--bg-color-alt2);
      border-radius: 5px;
      & > .list-item + .list-item {
        border-top: 1px solid #eee;
      }
      .list-item {
        padding: 15px 0;
        font-size: 16px;
        // color: #212121;
        color: var(--text);
        font-weight: 500;
        position: relative;
        display: flex;
        align-items: center;
        .avatar-img {
          width: auto;
          height: 45px;
          border-radius: 50%;
          margin-right: 15px;
        }
        .icon-student {
          margin-right: 8px;
        }
      }
    }
  }
}
// --------------------------------------------------------------------------
// Tile Stats
//---------------------------------------------------------------------------
.list-holder {
  margin: 0;
  padding: 15px;
  list-style: none;
  background: var(--bg-color-alt2);
  border-radius: 5px;
  & > .list-item + .list-item {
    border-top: 1px solid #eee;
  }
  .list-item {
    padding: 10px 0;
    font-size: 16px;
    color: #333;
    font-weight: normal;
    position: relative;
    display: flex;
    align-items: center;
    .avatar-img {
      width: auto;
      height: 45px;
      border-radius: 50%;
      margin-right: 25px;
    }
  }
}
</style>
