<template>
  <div
    v-if="
      $store.getters.getCurrentSlide && $store.getters.getCurrentSlide.slideId
    "
  >
    <div v-show="!isShowOption">
      <div class="TopMenu">
        <div class="row justify-content-between node-title">
          <div class="col-10">
            <!-- Teaching plan topic name (node's title) will be visible here -->
            <div class="block-ellipsis-1 ml-0">
              {{ this.$store.getters.selectedTOCNode.topicName }}
            </div>
            <!-- <div class="row justify-content-between align-items-center page-title-alt"> -->
            <div class="slide-count">
              {{ $t('TeacherPresentationMode.slide') }}
              <strong>{{
                isSlidesAvailable ? slideIndex + 1 : slideIndex
              }}</strong>
              of
              <strong>{{ $store.getters.getActiveSlides.length }}</strong>

              <!-- {{timerDisplayText}} -->
            </div>
            <!-- <button v-if="!isShowWelcome" @click="setWelcomeScreenStatus(true)" class="btn btn-ghost btn-blue">
              Show Ip
            </button>
            <button v-else @click="setWelcomeScreenStatus(false)" class="btn btn-ghost btn-blue">
              Hide Ip
            </button>-->
            <!-- <div class="col-auto">
            <span
              class="toggle-ip"
              v-if="!isShowWelcome"
              @click="setWelcomeScreenStatus(true)"
            >Show IP</span>
            <span
              class="toggle-ip"
              v-else
              @click="setWelcomeScreenStatus(false)"
            >Hide IP</span>
            </div>-->
            <!-- </div> -->
          </div>
          <!-- <div class="col-auto teal-text">
            <router-link to="/PresentationPreview">
              Jump to slide
            </router-link>
          </div>-->
          <div
            class="col-2"
            @click="exitPresentation"
          >
            <i class="mdi mdi-power cursor-pointer" />
          </div>
        </div>
      </div>
      <div class="TeacherPresentationMode wrap-alt bg-main">
        <div class="row justify-content-between align-items-center attendance">
          <div class="col mr-auto">
            <strong>{{ $t('TeacherPresentationMode.classroom_pin') }}</strong>
            <div class="class-pin">
              {{ $store.getters.getCurrentClassroomPin }}
            </div>
          </div>
          <div class="col-auto">
            <div><strong>{{ $t('TeacherPresentationMode.student_details') }}</strong></div>
            <div style="float:right;">
              <span
                class="present"
                @click="setLearnerListFor('active')"
              >
                <i class="mdi mdi-circle cursor-pointer" />
                <!-- 56 -->
                {{ activeUsers ? activeUsers.listOfUsers.length : 0 }}
              </span>
              <span
                class="absent"
                @click="setLearnerListFor('inActive')"
              >
                <i class="mdi mdi-circle cursor-pointer" />
                <!-- {{activeUsers.listOfUsers ? activeUsers.listOfUsers.length : 0}} -->
                {{ getInactiveUsers(connectedUsers, activeUsers) }}
                <!-- 3 -->
              </span>
            </div>
          </div>
        </div>
        <learnerListView
          v-if="showLearners"
          :learner-list="getLearnerList(learnerListFor)"
          :dynamic-class="dynamicClass"
          @closeLearnerListView="closeLearnerList"
          :display-text="displayText"
        />

        <div class="row presentation-list">
          <div class="col-12">
            <!-- <router-link to="/PresentationSlide">
            <img
              src="../../public/assets/images/presentation/5.png"
              class="list-img"
            >
            </router-link>-->
            <section
              class="slide-holder"
              :class="
                $store.getters.getActiveSlides[slideIndex].slideType ===
                  'methodDraw' ||
                  $store.getters.getActiveSlides[slideIndex].slideType ===
                  'canvasDraw' ||
                  $store.getters.getActiveSlides[slideIndex].slideType ===
                  'slideTemplates' ||
                  $store.getters.getActiveSlides[slideIndex].slideType ===
                  'svgTemplate'
                  ? ''
                  : 'scroll'
              "
              v-if="
                isSlidesAvailable && $store.getters.getActiveSlides[slideIndex]
              "
            >
              <questionTemplate
                v-if="
                  $store.getters.getActiveSlides[slideIndex].slideType ==
                    'questionTemplate'
                "
                :slide-position="'current'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex].slideOrdinality
                  )
                "
                :key="slideIndex"
                :template-path="
                  getSlidePreviewPath($store.getters.getCurrentSlide)
                "
                :template-name="
                  getSlidePreviewTemplateName($store.getters.getCurrentSlide)
                "
              />
              <gameTemplate
                v-if="
                  $store.getters.getActiveSlides[slideIndex].slideType ==
                    'gameTemplate' && !showStats
                "
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex].slideOrdinality
                  )
                "
                :slide-position="'current'"
                :template-path="
                  getSlidePreviewPath($store.getters.getCurrentSlide)
                "
                :template-name="
                  getSlidePreviewTemplateName($store.getters.getCurrentSlide)
                "
                :key="slideIndex"
              />
              <GameStatistics
                v-if="
                  $store.getters.getActiveSlides[slideIndex].slideType ==
                    'gameTemplate' && showStats
                "
                :stats-data="statsData"
                :game-data="$store.getters.getCurrentSlide.data"
                :plugin-properties="
                  $store.getters.getCurrentSlide.pluginProperties
                "
              />
              <presentationView
                v-if="
                  $store.getters.getActiveSlides[slideIndex].slideType ==
                    'slideTemplates'
                "
                :slide-position="'current'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex].slideOrdinality
                  )
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getCurrentSlide)
                "
                :template-name="
                  getSlidePreviewTemplateName($store.getters.getCurrentSlide)
                "
                :key="slideIndex"
              />
              <EmbeddedIframe
                v-if="
                  $store.getters.getActiveSlides[slideIndex].slideType ==
                    'embedTemplate'
                "
                :slide-position="'current'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex].slideOrdinality
                  )
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getCurrentSlide)
                "
                :template-name="
                  getSlidePreviewTemplateName($store.getters.getCurrentSlide)
                "
                :key="slideIndex"
              />
              <div
                :class=" getPresentationMode( Number(
                  $store.getters.getActiveSlides[slideIndex].slideOrdinality
                ), 'current' ) == 'manual-upload' ? 'svgTemplate' : 'svgTemplate-alt'"
              >
                <svgTemplate
                  v-if="
                    $store.getters.getActiveSlides[slideIndex].slideType ==
                      'svgTemplate'
                  "
                  :slide-position="'current'"
                  :index="
                    Number(
                      $store.getters.getActiveSlides[slideIndex].slideOrdinality
                    )
                  "
                  :template-path="
                    getSlidePreviewPath($store.getters.getCurrentSlide)
                  "
                  :template-name="
                    getSlidePreviewTemplateName($store.getters.getCurrentSlide)
                  "
                  :key="slideIndex"
                />
              </div>

              <methodDrawView
                v-if="
                  $store.getters.getActiveSlides[slideIndex].slideType ==
                    'methodDraw' ||
                    $store.getters.getActiveSlides[slideIndex].slideType ==
                    'canvasDraw'
                "
                :slide-position="'current'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex].slideOrdinality
                  )
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getCurrentSlide)
                "
                :template-name="
                  getSlidePreviewTemplateName($store.getters.getCurrentSlide)
                "
                :key="slideIndex"
              />
            </section>
          </div>
          <!-- {{$store.getters.getActiveSlides[slideIndex]['slideType']}} -->
          <div
            class="col-12"
            v-if="showStudentResponsesStatus"
          >
            <div class="note margin-custom-top">
              <b-button
                class="pending-count btn btn-ghost btn-blue "
                @click="showAnswer()"
              >
                {{ pendingResponses }}
              </b-button>
              <!-- <span class="pending-count" @click="$router.push('v-b-modal.modal-1') ">{{ pendingResponses }} </span>{{connectedUsers.listOfUsers}} -->
              <span
                class="subtext"
              >
                {{ $t('TeacherPresentationMode.students_left_to_answer') }}
              </span>
            </div>
            <!-- <div class="page-title">
            <div v-show="!isPendingResponses">
                 <li v-for="item in filteredUsers">{{item.basicInfo.fullName}}</li>
                 </div>
                 </div> -->
            <div v-if="isPendingResponses">
              <StudentPendingResponses
                @back="hidePendingResponses"
                :filtered-users="filteredUsers || []"
                :pending-responses="pendingResponses"
              />
            </div>
            <!-- <div class="note margin-custom-top">
              <span class="pending-count">{{ pendingResponses }}</span> Students left to respond out of {{ connectedUsersCount }}
            </div> -->
            <div class="chart">
              <apexchart
                type="pie"
                :options="chartOptions"
                :series="[pendingResponses, totalSubmittedResponses]"
              />
            </div>
            <!-- <apexchart
              type="donut"
              :options="chartOptions"
              :series="[pendingResponses,connectedUsersCount]"
            /> -->
            <!--  <div
              class="pending-option-holder"
            >
              <div class="option-value-text">
                Pending responses
              </div>
              <div class="progress-holder-alt">
                <b-progress
                  :value="calculatePendingReponsesPercentage()"
                  height="24px"
                />

                <div class="ans-percent">
                  <div class="percent-val">

                    {{ pendingResponses }}
                  </div>
                </div>
              </div>
            </div>-->
          </div>
          <div
            class="col-12"
            v-if="
              isSlidesAvailable &&
                $store.getters.getActiveSlides[slideIndex].slideType ==
                'questionTemplate'
            "
          >
            <!-- {{$store.getters.getActiveSlides[slideIndex]}} -->
            <!-- <questionModule :question-object="$store.getters.getCurrentSlide" /> -->

            <questionModule
              :question-object="$store.getters.getCurrentSlide.extendedData"
              :slide-id="$store.getters.getCurrentSlide.slideId"
              :question-properties="
                $store.getters.getCurrentQuestionProperties || {}
              "
              :stats-data="statsData"
              :total-submitted-responses="totalSubmittedResponses"
              :connected-users-count="connectedUsersCount"
              @showOptions="showOptions"
              @showRelatedLearners="showRelatedLearners"
            />
          </div>
          <learnerListView
            v-if="showLearnerList"
            :learner-list="learnerList"
            :dynamic-class="dynamicClass"
            @closeLearnerListView="closeLearnerListView"
            :display-text="displayText"
          />
          <div
            v-if="
              isSlidesAvailable &&
                $store.getters.getActiveSlides[slideIndex].slideType ==
                'canvasDraw'
            "
            class="emojis-status"
          >
            <div
              class="emoji-stats emo-like"
              @click="fetchLearnerList('like', 'emo-like')"
            >
              <i class="mdi mdi-thumb-up" />
              <span>{{ statsData['like'] || 0 }}</span>
            </div>
            <div
              class="emoji-stats emo-question"
              @click="fetchLearnerList('question', 'emo-question')"
            >
              <span class="q-mark">?</span>
              <span>{{ statsData['question'] || 0 }}</span>
            </div>
          </div>
          <div
            class="col-12"
            v-if="
              $store.getters.getCurrentSlide.slideNotes !== undefined &&
                $store.getters.getCurrentSlide.slideNotes !== ''
            "
          >
            <div class="main-text mt-4">
              <strong>{{ $t('TeacherPresentationMode.notes') }}</strong>
            </div>
            <div class="sub-text">
              <!-- Presentation notes -->
              {{
                $store.getters.getCurrentSlide.slideNotes
                  ? $store.getters.getCurrentSlide.slideNotes
                  : ''
              }}
            </div>
          </div>
        </div>

        <div
          class="row presentation-list"
          v-show="
            isSlidesAvailable && $store.getters.getActiveSlides[slideIndex + 1]
          "
        >
          <div class="col-12 title-slide mt-2">
            <strong>{{ $t('TeacherPresentationMode.next_slide') }}</strong>
          </div>
          <div class="col-12">
            <!-- <img
              v-if="!(isSlidesAvailable && $store.getters.getActiveSlides[slideIndex + 1])"
              src="../../public/assets/images/presentation/5.png"
              class="list-img"
            >-->
            <section
              class="slide-holder"
              v-if="
                isSlidesAvailable &&
                  $store.getters.getActiveSlides[slideIndex + 1] &&
                  $store.getters.getNextSlideDetails &&
                  $store.getters.getNextSlideDetails.slideId
              "
            >
              <questionTemplate
                v-if="
                  $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                    'questionTemplate'
                "
                :slide-position="'next'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex + 1]
                      .slideOrdinality
                  ) + 1
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getNextSlideDetails)
                "
                :template-name="
                  getSlidePreviewTemplateName(
                    $store.getters.getNextSlideDetails
                  )
                "
                :key="slideIndex"
              />
              <gameTemplate
                v-if="
                  $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                    'gameTemplate'
                "
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex + 1]
                      .slideOrdinality
                  ) + 1
                "
                :slide-position="'next'"
                :template-path="
                  getSlidePreviewPath($store.getters.getNextSlideDetails)
                "
                :template-name="
                  getSlidePreviewTemplateName(
                    $store.getters.getNextSlideDetails
                  )
                "
                :key="slideIndex"
              />
              <presentationView
                v-if="
                  $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                    'slideTemplates'
                "
                :slide-position="'next'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex + 1]
                      .slideOrdinality
                  ) + 1
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getNextSlideDetails)
                "
                :template-name="
                  getSlidePreviewTemplateName(
                    $store.getters.getNextSlideDetails
                  )
                "
                :key="slideIndex"
              />
              <EmbeddedIframe
                v-if="
                  $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                    'embedTemplate'
                "
                :slide-position="'next'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex + 1]
                      .slideOrdinality
                  ) + 1
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getNextSlideDetails)
                "
                :template-name="
                  getSlidePreviewTemplateName(
                    $store.getters.getNextSlideDetails
                  )
                "
                :key="slideIndex"
              />
              <div
                :class=" getPresentationMode( Number(
                  $store.getters.getActiveSlides[slideIndex + 1]
                    .slideOrdinality
                ) + 1, 'next') == 'manual-upload' ? 'svgTemplate' : 'svgTemplate-alt'"
              >
                <svgTemplate
                  v-if="
                    $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                      'svgTemplate'
                  "
                  :slide-position="'next'"
                  :index="
                    Number(
                      $store.getters.getActiveSlides[slideIndex + 1]
                        .slideOrdinality
                    ) + 1
                  "
                  :template-path="
                    getSlidePreviewPath($store.getters.getNextSlideDetails)
                  "
                  :template-name="
                    getSlidePreviewTemplateName(
                      $store.getters.getNextSlideDetails
                    )
                  "
                  :key="slideIndex"
                />
              </div>

              <methodDrawView
                v-if="
                  $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                    'methodDraw' ||
                    $store.getters.getActiveSlides[slideIndex + 1].slideType ==
                    'canvasDraw'
                "
                :slide-position="'next'"
                :index="
                  Number(
                    $store.getters.getActiveSlides[slideIndex + 1]
                      .slideOrdinality
                  ) + 1
                "
                :template-path="
                  getSlidePreviewPath($store.getters.getNextSlideDetails)
                "
                :template-name="
                  getSlidePreviewTemplateName(
                    $store.getters.getNextSlideDetails
                  )
                "
                :key="slideIndex"
              />
            </section>
          </div>
        </div>
        <!-- <div class="row slides justify-content-between">
        <div class="col-4">
          <section
            class="slide-holder"
            v-if="isSlidesAvailable && $store.getters.getActiveSlides[slideIndex +1]"
        >-->
        <!-- <questionTemplate
              v-if="$store.getters.getActiveSlides[slideIndex +1].slideType=='questionTemplate'"
              :slidePosition="''"
              :index="slideIndex + 1"
              :templatePath="getSlidePreviewPath($store.getters.getActiveSlides[slideIndex + 1])"
            />
            <presentationView
              v-if="$store.getters.getActiveSlides[slideIndex +1].slideType=='slideTemplates'"
              :index="Number($store.getters.getActiveSlides[slideIndex +1].slideOrdinality)"
              :template-path="getSlidePreviewPath($store.getters.getActiveSlides[slideIndex +1])"
        />-->
        <!-- <img
              src="../../public/assets/images/presentation/5.png"
              class="slides-img"
            >
          </section>
          <img
            v-else
            src="../../public/assets/images/presentation/5.png"
            class="slides-img"
          >
        </div>
        <div class="col-4">
          <img
            src="../../public/assets/images/presentation/5.png"
            class="slides-img"
          >
        </div>
        <div class="col-4">
          <img
            src="../../public/assets/images/presentation/5.png"
            class="slides-img"
          >
        </div>
        </div>-->

        <!-- <div class="row">
        <div class="col-12">
          <div class="card-blue">
            <div class="row">
              <div class="col-12 mb-5">
                <span class="icon">
                  <i class="mdi mdi-wifi" />
                </span>
                <span class="sub-title">Student wifi details</span>
              </div>
              <div class="col borderRight">
                <div class="count">
                  57
                </div>Connected
              </div>
              <div class="col pl-4">
                <div class="count">
                  03
                </div>Disconnected
              </div>
            </div>
          </div>
        </div>
        </div>-->
        <div class="BottomMenuOptions">
          <!-- <div class="card-default">
          <div class="row align-items-center">
            <div class="col-auto">
              <i class="mdi mdi-information" />
            </div>
            <div class="col pl-0">
              The presentation will start from slide 1
            </div>
          </div>
          </div>-->

          <!-- <div class="row no-gutters"> -->
          <!-- <div class="col-4"> -->
          <!-- <router-link to="/StartPresentation">
              <button class="btn btn-orange">
                Previous
              </button>
          </router-link>-->
          <button
            @click="prevSlide"
            :disabled="!isSlidesAvailable || slideIndex === 0"
            ref="prevSlide"
            class="btn btn-orange btn-effect-orange"
          >
            {{ $t('TeacherPresentationMode.previous') }}
          </button>
          <!-- </div> -->
          <!-- <div class="col-8"> -->
          <!-- <div class="row justify-content-center"> -->
          <div v-if="isShowNextBtnGroup">
            <button
              ref="nextAction"
              v-if="isShowNextBtnGroup"
              :class="'btn btn-blue-alt-stats btn-effect-blue'"
              @click="nextAction(actionFor)"
            >
              <!-- <span v-if="showStudentResponsesStatus">
                <span
                  class="pending-response"
                >
                  Stats
                  <div class="count">54  left to answer</div>
                </span>
              </span> -->

              <!-- <span v-else> -->
              {{ $t('TeacherPresentationMode.stats') }}
              <!-- </span> -->
            </button>
          </div>
          <div
            :class="
              !isShowNextBtnGroup
                ? 'btn-blue-alt-stats btn-effect-blue'
                : 'btn-blue-alt btn-effect-blue  p-0 '
            "
          >
            <button
              @click="nextSlide"
              ref="nextSlide"
              v-if="
                !(
                  !isSlidesAvailable ||
                  slideIndex === $store.getters.getActiveSlides.length - 1
                )
              "
              class="btn btn-blue btn-effect-blue"
              :class="isShowNextBtnGroup ? 'btn-no-radius btn-blue-alt' : ''"
            >
              <!-- {{isShowNextBtnGroup ? '>' :'Next'}} -->
              <span
                v-if="isShowNextBtnGroup"
                class="mdi mdi-chevron-right icon-next"
              />
              <span v-else>{{ $t('TeacherPresentationMode.next') }}</span>
            </button>
            <button
              @click="exitPresentation"
              ref="nextSlide"
              v-else
              class="btn btn-blue btn-effect-blue"
              :class="isShowNextBtnGroup ? 'btn-blue btn-no-radius' : ''"
            >
              <!-- {{isShowNextBtnGroup ? '>' :'Next'}} -->
              <span
                v-if="isShowNextBtnGroup"
                class="mdi mdi-power"
              />
              <span v-else>{{ $t('TeacherPresentationMode.end') }}</span>
            </button>
          </div>
          <!-- </div> -->
          <!-- </div> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
    <div v-show="isShowOption">
      <!--  TODO: show option component -->
      <TeacherPresentationModeAnswerView
        @back="hideOptions"
        :index="slideIndex"
        :key="slideIndex"
        :template-path="getSlidePreviewPath($store.getters.getCurrentSlide)"
        :question-object="$store.getters.getCurrentSlide.extendedData"
        :question-properties="$store.getters.getCurrentQuestionProperties || {}"
        :template-name="
          getSlidePreviewTemplateName($store.getters.getCurrentSlide)
        "
      />
    </div>

    <!-- <b-modal id="modal-1" title="BootstrapVue">
    <li v-for="item in filteredUsers">{{item.basicInfo.fullName}}</li>
  </b-modal>
    -->
  </div>
</template>

<script>
// import TopMenu from '@/components/common/TopMenu'
// import BottomMenu from '@/components/common/BottomMenu'
import questionTemplate from '../components/questionTemplate'
import EmbeddedIframe from '../components/EmbeddedIframe'
import gameTemplate from '../components/gameTemplate'
import presentationView from '../components/presentationView'
import methodDrawView from '../components/methodDrawView'
import GameStatistics from '@/components/results/GameStatistics.vue'
import svgTemplate from '../components/svgTemplate'

// import chart from '../components/chart'
import questionModule from '../components/TeacherPresentationModeMCQ'
import TeacherPresentationModeAnswerView from '../components/TeacherPresentationModeAnswerView'
import StudentPendingResponses from '../components/StudentPendingResponses'
// import { PRESENTATION_STATUS } from '../utils/Constants'
import SystemDialog from '../utils/SystemDialog'
import learnerListView from '../components/LearnerListPage'
import { eventBus } from '@/main'
import MQL from '@/plugins/mql.js'

import VueApexCharts from 'vue-apexcharts'
import StoreDataOperation from '@/plugins/StoreDataOperation.js'
export default {
  name: 'PresentationSlide',
  components: {
    questionModule,
    questionTemplate,
    methodDrawView,
    presentationView,
    EmbeddedIframe,
    gameTemplate,
    TeacherPresentationModeAnswerView,
    learnerListView,
    apexchart: VueApexCharts,
    GameStatistics,
    StudentPendingResponses,
    svgTemplate
    // , chart
    // TopMenu
    // BottomMenu
  },
  // // me
  // // methods:{
  // //   docount(){
  // //     this.$router.push({name: 'TeachingPlanDashboard'})
  // //   }
  // },
  computed: {
    getLearnerList () {
      return (data) => {
        let list = []
        if (data === 'active') {
          list = this.activeUsers ? this.activeUsers.listOfUsers : []
        } else if (data === 'inActive') {
          if (!this.activeUsers || this.activeUsers.listOfUsers.length < 1) {
            list = this.connectedUsers ? this.connectedUsers.listOfUsers : []
          } else {
            list =
              this.connectedUsers && this.connectedUsers.listOfUsers.length > 0
                ? this.connectedUsers.listOfUsers.filter(function (item) {
                    let index = this.activeUsers.listOfUsers.findIndex(
                      (activeLearner) =>
                        activeLearner.learnerId === item.learnerId
                    )
                    return index === -1
                  }, this)
                : []
          }
        }
        return list
      }
    },
    getSlidePreviewPath () {
      return (slide) => {
        let path
        switch (slide.dependancies.componentType) {
          case 'html':
            path =
              slide.dependancies.templateName +
              '/' +
              slide.dependancies.teacherFileName +
              (slide.dependancies.teacherFileName.includes('.html')
                ? ''
                : '.html')
            break
          case 'vue':
            path = slide.dependancies.templateName + '/index.html'
            break
          case 'methodDraw':
            path = 'methodDrawViews/index.html'
            break
          case 'canvasDraw':
            path = 'methodDrawViews/index.html'
            break
        }
        return this.templateFolderPath + path
      }
    },
    getSlidePreviewTemplateName () {
      return (slide) => {
        let name
        switch (slide.dependancies.componentType) {
          case 'vue':
            name = slide.dependancies.templateName
            break
          case 'methodDraw':
            name = 'methodDrawViews'
            break
          case 'canvasDraw':
            name = 'methodDrawViews'
            break
        }
        return name
      }
    }
  },
  data () {
    return {
      intervalTime: 2000,
      slideIndex: 0,
      isChartShow: false,
      selectedSlideNumber: '',
      templateFolderPath: this.$store.getters.getTemplateFolderPath,
      slideNumbers: [],
      searchText: '',
      filteredSlides: [],
      showSearchResult: false,
      currentSearchResultIndex: 0,
      isSlidesAvailable: false,
      isPause: false,
      timerDisplayText: '',
      timer: '',
      statsData: {},
      connectedUsers: null,
      connectedUsersCount: 0,
      activeUsers: null,
      isShowWelcome: false,
      isShowOption: false,
      isShowNextBtnGroup: false,
      showStudentResponsesStatus: false,
      pendingResponses: 0,
      totalSubmittedResponses: 0,
      actionFor: '',
      showLearnerList: false,
      learnerList: [],
      dynamicClass: '',
      displayText: '',
      responseSubmittedUsers: [],
      notSubmittedAnswer: [],
      filteredUsers: [],
      isPendingResponses: false,

      chartOptions: {
        chart: {
          fontFamily: 'Avenir, Helvatica, sans-serif'
        },
        legend: {
          show: true
        },
        dataLabels: {
          style: {
            fontSize: '17px',
            fontWeight: 'medium'
          },
          enabled: false
          // formatter: function (val) {
          //   return val
          // },
          // textAnchor: 'middle',
          // offsetX: 90,
          // offsetY: 50
        },
        labels: ['Not answered', 'Answered'],

        pie: {
          customScale: 1
        },
        grid: {
          show: false
        },
        colors: ['#45529b', '#77bbb2', '#ffc107']
      },
      series: [10, 20],
      showStats: false,
      showLearners: false,
      learnerListFor: ''
    }
  },
  methods: {
    getPresentationMode (index, slidePosition) {
    console.log('index, slidePosition', index, slidePosition)
      let storeDataOperation = new StoreDataOperation(index, slidePosition)
      console.log('storeDataOperation.getCurrentSlideData()', storeDataOperation.getCurrentSlideData())
      if (storeDataOperation.getCurrentSlideData() && storeDataOperation.getCurrentSlideData().svg && storeDataOperation.getCurrentSlideData().svg.mode) {
        return storeDataOperation.getCurrentSlideData().svg.mode
      }
      return 'manual-upload'
    },
    showAnswer () {
      this.isPendingResponses = true
    },
    calculatePendingReponsesPercentage () {
      this.totalSubmittedResponses =
        Number(this.statsData['totalResponses']) || 0
      this.pendingResponses =
        this.connectedUsersCount - this.totalSubmittedResponses

      this.filteredUsers = this.connectedUsers.listOfUsers.filter(function (
        item
      ) {
        var isPresent = !this.responseSubmittedUsers.includes(item.learnerId)

        return isPresent
      },
      this)

      return (
        Math.ceil(
          (Number(this.pendingResponses) / Number(this.connectedUsersCount)) *
            100
        ) || 0
      )

      // return 60
    },
    setWelcomeScreenStatus (status) {
      this.$store.dispatch('setWelcomeStatus', {
        slideId: this.$store.getters.getCurrentSlide.slideId,
        isShowWelcome: status,
        sessionManagerId: this.$store.getters.sessionManagerId
      })
      this.isShowWelcome = status
    },
    publishAnswer () {
      this.$store
        .dispatch('setStatsStatus', {
          slideId: this.$store.getters.getCurrentSlide.slideId,
          showStats: true,
          sessionManagerId: this.$store.getters.sessionManagerId
        })
        .then((res) => {
          if (res) {
            this.isShowNextBtnGroup = false
          }
        })
    },
    fetchLearnerList (textToSend, dynamicClass) {
      let temp = { textToSend: textToSend, dynamicClass: dynamicClass }
      this.showRelatedLearners(temp)
    },
    showRelatedLearners (obj) {
      this.$store.dispatch('getLearnerList', obj.textToSend).then((data) => {
        if (data) {
          this.learnerList = data
          this.showLearnerList = true
          if (data.length > 0) {
            this.displayText = this.$t('TeacherPresentationMode.displayText1')
            if (obj.textToSend === 'correctAnswer') {
              this.displayText =
                this.displayText + this.$t('TeacherPresentationMode.correctly')
            } else if (obj.textToSend === 'inCorrectAnswer') {
              this.displayText =
                this.displayText +
                this.$t('TeacherPresentationMode.incorrectly')
            } else if (obj.textToSend === 'notKnown') {
              this.displayText =
                this.displayText + this.$t('TeacherPresentationMode.dontKnow')
            } else if (obj.textToSend === 'like') {
              this.displayText =
                this.displayText + this.$t('TeacherPresentationMode.like')
            } else if (obj.textToSend === 'question') {
              this.displayText =
                this.displayText + this.$t('TeacherPresentationMode.question')
            } else {
              // in case of optionId
              this.displayText = this.$t('TeacherPresentationMode.displayText2')
            }
          } else {
            this.displayText = this.$t('TeacherPresentationMode.displayText3')
          }
        } else {
          this.learnerList = []
          this.showLearnerList = true
          this.displayText = this.$t('TeacherPresentationMode.displayText3')
        }
        this.dynamicClass = obj.dynamicClass
      })
    },
    showOptions () {
      this.isShowOption = true
    },
    closeLearnerListView () {
      this.showLearnerList = false
    },
    setLearnerListFor (data) {
      this.learnerListFor = data
      this.showLearners = true
      if (data === 'active') {
        this.dynamicClass = 'present'
        this.displayText = this.$t('TeacherPresentationMode.active_learners')
      } else if (data === 'inActive') {
        this.dynamicClass = 'absent'
        this.displayText = this.$t('TeacherPresentationMode.in_active_learners')
      }
    },
    closeLearnerList () {
      this.showLearners = false
      this.dynamicClass = ''
      this.displayText = ''
    },
    hideOptions () {
      this.isShowOption = false
    },
    hidePendingResponses () {
      this.isPendingResponses = false
    },
    getInactiveUsers (connectedUsers, activeUsers) {
      let activeCount = activeUsers ? activeUsers.listOfUsers.length : 0
      let conntectedCount = connectedUsers
        ? connectedUsers.listOfUsers.length
        : 0

      let inactiveCount = conntectedCount - activeCount

      return inactiveCount > 0 ? inactiveCount : 0
    },
    exitPresentation () {
      SystemDialog.confirm(
        this.$t('TeacherPresentationMode.close_presentation'),
        this.$t(
          'TeacherPresentationMode.are_you_sure_you_want_to_close_the_presentation'
        ),
        this.$t('TeacherPresentationMode.yes'),
        this.$t('TeacherPresentationMode.no'),
        (isOk) => {
          if (isOk) {
            // confirmed
            this.closePresentation().then((currentClassroomSummary) => {
              this.updateSummaryCount(
                currentClassroomSummary
              )
              this.$store
                .dispatch(
                  'setLastPresentationSummaryData',
                  currentClassroomSummary
                )
                .then((result) => {
                  this.$store.commit(
                    'setSummary',
                    this.$store.getters.getCurrentPresentation
                  )
                  this.$store.commit('setCurrentSummary', null)
                  // removing custom back button listener
                  this.$router.setCustomBackListener(null)
                  if (!this._isDestroyed) {
                    this.$router.goBack()
                  }
                  // this.$router.go(-1)
                })
            })
          }
        }
      )
    },
    updateSummaryCount (PCOBJ) {
     let presentationCacheObj = {
        presentationCacheId: PCOBJ.presentationCacheId,
        presentationId: PCOBJ.presentationId,
        teacherName: PCOBJ.summary.teacherName,
        presentationStartTime: PCOBJ.summary.presentationStartTime,
        name: this.$store.getters.presentationDetails.name ? this.$store.getters.presentationDetails.name : ' ',
        description: this.$store.getters.presentationDetails.description ? this.$store.getters.presentationDetails.description : ' '
      }
      var data = {}
      data['presentationCacheObj'] = presentationCacheObj
      data['teachingPlanId'] = this.$store.getters.teachingPlanId
      data['topicId'] = this.$store.getters.selectedTOCNode.topicId
      data['instituteId'] = this.$store.getters.selectedInstitute.instituteId
      data['unitId'] = this.$store.getters.selectedUnit.unitId
      new MQL()
        .setActivity('r.[UpsertTopicSummaries]')
        .setData(data)
        .fetch()
        .then((rs) => {
          // let res = rs.getActivity('UpsertTopicSummaries', true)
          if (rs.isValid('UpsertTopicSummaries')) {

          } else {
            rs.showErrorToast('UpsertTopicSummaries')
          }
        })
    },
    customBackListener () {
      this.exitPresentation()
    },
    startTimer (countDownTime) {
      this.timerDisplayText = '' + countDownTime
      if (countDownTime > 0) {
        countDownTime--
        this.timer = setTimeout(() => {
          this.startTimer(countDownTime)
        }, 1000)
      }
    },
    stopTimer () {
      clearTimeout(this.timer)
    },
    closeSearchResult () {
      this.showSearchResult = false
      this.filteredSlides = []
      this.currentSearchResultIndex = 0
    },
    setSearchResult () {
      if (this.filteredSlides && length) {
        this.currentSearchResultIndex = 0
        this.jumpToSlide(
          this.filteredSlides[this.currentSearchResultIndex].activeIndex
        )
      }
    },
    search () {
      if (this.searchText !== '') {
        this.showSearchResult = false
        if (event.keyCode === 13) {
          this.filteredSlides = []
          this.filteredSlides = (
            this.$store.getters.getActiveSlides || []
          ).filter((slide, index) => {
            return (
              slide.searchText &&
              slide.searchText
                .toLowerCase()
                .includes(this.searchText.toLowerCase())
            )
          })
          if (this.filteredSlides && this.filteredSlides.length > 0) {
            this.setSearchResult()
          }
          this.showSearchResult = true
        }
      }
    },
    genrateSlideNumbers () {
      let list = []
      for (let i = 1; i <= this.$store.getters.getActiveSlides.length; i++) {
        list.push(i)
      }
      this.slideNumbers = list
    },

    openModal () {
      this.isChartShow = true
    },
    prehook (data) {
      this.statsData = {}
      return new Promise((resolve, reject) => {
        // if(data.slideTime){
        // this.startTimer(data.slideTime)
        // }
        // this.$log.info('prehook called', data)
        // this.$log.info('prehook slideIndex', this.slideIndex)
        resolve(true)
      })
    },
    posthook (data) {
      return new Promise((resolve, reject) => {
        // this.stopTimer()
        // this.$log.info('posthook called', data)
        // this.$log.info('posthook slideIndex', this.slideIndex)
        resolve(true)
      })
    },
    setPause () {
      this.isPause = true
    },
    setPlay () {
      this.isPause = false
    },
    nextAction (data) {
      switch (data) {
        case 'questionStats':
          this.publishAnswer()
          break
      }
    },
    nextSlide () {
      this.showLearnerList = false
      this.$refs.nextSlide.disabled = true
      this.posthook(this.$store.getters.getCurrentSlide).then((res) => {
        this.setCurrentSlide(
          this.$store.getters.getActiveSlides[this.slideIndex + 1]
        ).then((res) => {
          if (res) {
            this.$refs.nextSlide.disabled = false
            this.slideIndex = this.slideIndex + 1
            this.prehook(this.$store.getters.getCurrentSlide)
            this.setPluginData(
              this.$store.getters.getCurrentSlideMetadata.slideType
            )
            this.pushNotification(this.$store.getters.getCurrentSlideMetadata.slideType)
          }
        })
      })
    },
    prevSlide () {
      this.showLearnerList = false
      this.$refs.prevSlide.disabled = true
      this.posthook(this.$store.getters.getCurrentSlide).then((res) => {
        this.setCurrentSlide(
          this.$store.getters.getActiveSlides[this.slideIndex - 1]
        ).then((res) => {
          if (res) {
            this.$refs.prevSlide.disabled = false
            this.slideIndex = this.slideIndex - 1
            this.prehook(this.$store.getters.getCurrentSlide)
            this.setPluginData(
              this.$store.getters.getCurrentSlideMetadata.slideType
            )
            this.pushNotification(this.$store.getters.getCurrentSlideMetadata.slideType)
          }
        })
      })
    },
    jumpToSlide (selectedSlideNumber) {
      this.posthook(this.$store.getters.getCurrentSlide).then((res) => {
        this.setCurrentSlide(
          this.$store.getters.getActiveSlides[selectedSlideNumber]
        ).then((res) => {
          if (res) {
            this.slideIndex = selectedSlideNumber
            this.selectedSlideNumber = ''
            this.prehook(this.$store.getters.getCurrentSlide)
            this.setPluginData(
              this.$store.getters.getCurrentSlideMetadata.slideType
            )
          }
        })
      })
    },
    changeCurrentSlide (slide) {
      this.posthook(this.$store.getters.getCurrentSlide).then((res) => {
        if (res) {
          this.$store.commit('setCurrentSlide', slide)

          this.slideIndex = this.$store.getters.getCurrentSlideActiveIndex
          this.prehook(this.$store.getters.getCurrentSlide)
          this.setPluginData(
            this.$store.getters.getCurrentSlideMetadata.slideType
          )
        }
      })
    },
    addActiveIndex () {
      this.$store.commit('addActiveIndex')
    },
    createSearchText () {
      this.$store.dispatch('createSearchText')
    },
    checkSlidesAvailability () {
      this.isSlidesAvailable =
        this.$store.getters.getActiveSlides &&
        this.$store.getters.getActiveSlides.length > 0
    },
    // getCommonData (tempData) {
    //   tempData.classroomId = '2c24ce8c-4bc4-43be-ae9a-f87fc3d96c67'
    //   // tempData.classroomId = this.$store.getters.selectedClassroom.classroomId;
    //   tempData.subjectId = '1001'
    //   // tempData.subjectId = this.$store.getters.selectedSubject.subjectId;
    //   tempData.tempFileId =
    //     'temp_' + tempData.classroomId + '_' + tempData.subjectId
    //   return tempData
    // },
    setCurrentPresentationDetails (data) {
      let tempData = {}
      // tempData = this.getCommonData(tempData)
      tempData.currentPresentationDetails = data
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('setCurrentPresentationDetails', tempData)
          .then((res) => {
            resolve(res)
          })
      })
    },
    setCurrentSlideNumber (currentSlideNumber) {
      this.setPause()
      let tempData = {}
      // tempData = this.getCommonData(tempData)
      tempData.currentSlideNumber = '' + currentSlideNumber
      return new Promise((resolve, reject) => {
        this.$store.dispatch('setCurrentSlideNumber', tempData).then((res) => {
          this.setPlay()
          resolve(res)
        })
      })
    },
    setCurrentSlide (slideMetadata) {
      this.setPause()
      // let tempData = {}
      // tempData = this.getCommonData(slideMetadata)
      // tempData.slideMetadata = slideMetadata;
      return new Promise((resolve, reject) => {
        // this.$store.dispatch('setCurrentSlide', tempData).then((res) => {
        this.$store.dispatch('setCurrentSlide', slideMetadata).then((res) => {
          if (res) {
            this.setPlay()
            resolve(res)
          }
        })
      })
    },
    closePresentation (data) {
      this.setPause()
      // data = this.getCommonData(data || {})
      data = data || {}
      data['presentationId'] = this.$store.getters.getPresentationId
      data['sessionManagerId'] = this.$store.getters.sessionManagerId
      data['slideId'] = this.$store.getters.getCurrentSlide.slideId
      return new Promise((resolve, reject) => {
        this.$store.dispatch('closePresentation', data).then((res) => {
          this.$store.commit('resetSlideState')
          this.setPlay()
          resolve(res)
        })
      })
    },
    getCurrentSlide () {
      // let temp = this.getCommonData({})
      let temp = {}
      temp.sessionManagerId = this.$store.getters.sessionManagerId
      return new Promise((resolve, reject) => {
        this.$store.dispatch('getCurrentSlide', temp).then((res) => {
          if (res) {
            if (Array.isArray(res)) {
              res = res[0]
            }

            if (res.status !== 'SlideNotFound') {
              resolve(res)
            } else {
              resolve(false)
            }
          }
          resolve(false)
        })
      })
    },
    getCurrentStats () {
      let tempData = {
        slideId: this.$store.getters.getCurrentSlide.slideId,
        sessionManagerId: this.$store.getters.sessionManagerId
      }
      this.$store.dispatch('getCurrentStatsBySlideId', tempData).then((res) => {
        if (res) {
          this.statsData = res.stats || {}

          this.connectedUsers = res.connectedUsers
          this.activeUsers = res.activeUsers
          // this.responseSubmittedUsers=res.responseSubmittedUsers
        }
      })
    },
    getCurrentPresentationDetails () {
      // let temp = this.getCommonData({})
      let temp = {}
      temp.sessionManagerId = this.$store.getters.sessionManagerId
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('getCurrentPresentationDetails', temp)
          .then((res) => {
            if (res) {
              if (!res.slidesMetadata) {
                resolve(false)
              }
              this.$store.commit('setSlides', res.slidesMetadata)
              this.addActiveIndex()
              this.$store
                .dispatch('setCurrentPresentation', res)
                .then((setCurrentPresentationRes) => {
                  if (setCurrentPresentationRes) {
                    this.getCurrentSlide().then((getCurrentSlideRes) => {
                      if (getCurrentSlideRes) {
                        this.$store.commit(
                          'setCurrentSlide',
                          getCurrentSlideRes.slideObj
                        )
                        this.slideIndex = this.$store.getters.getCurrentSlideActiveIndex
                        this.$store
                          .dispatch('getNextSlide', {
                            slideId: this.$store.getters.getActiveSlides[this.slideIndex + 1]
                              ? this.$store.getters.getActiveSlides[this.slideIndex + 1].slideId
                              : ''
                          })
                          .then((res) => {
                            if (res) {
                              this.setNextSlideInStore(res)
                            }
                            resolve(true)
                          })
                      } else {
                        resolve(false)
                      }
                    })
                  }
                })
            } else {
              resolve(false)
            }
          })
      })
    },
    setPluginData (data) {
      switch (data) {
        case 'questionTemplate':
          this.actionFor = 'questionStats'
          this.isShowNextBtnGroup = true
          this.showStudentResponsesStatus = true
          break
        case 'gameTemplate':
          this.actionFor = 'questionStats'
          this.isShowNextBtnGroup = true
          this.showStudentResponsesStatus = true
          break
        default:
          this.showStudentResponsesStatus = false
          this.isShowNextBtnGroup = false
          break
      }
    },
    pushNotification (data) {
      let temp = {
        classroomId: this.$store.getters.presentationCacheId,
        // notifyAll: true,
        notification: {
          body: '',
          title: ''
        }
      }
      switch (data) {
        case 'questionTemplate':
          temp.notification.body = 'Question slide'
          temp.notification.title = 'Presentation'
          this.$store.dispatch('pushNotification', temp)
          break
        case 'gameTemplate':
          break
        default:
          break
      }
    },
    setNextSlideInStore (data) {
      this.$store.commit('setNextSlideDetails', data)
    },
     SetCurrentPresentationRunningTillDate () {
      this.$store
        // .dispatch('SetCurrentPresentationRunningTillDate', this.getCommonData({}))
        .dispatch('SetCurrentPresentationRunningTillDate', {})
        .then((res) => {
          if (!this._isDestroyed) {
            setTimeout(() => {
              this.SetCurrentPresentationRunningTillDate()
            }, 15000)
          }
        })
    },
    getCurrentPresentationStatus () {
      this.$store
        // .dispatch('getCurrentPresentationStatus', this.getCommonData({}))
        .dispatch('getCurrentPresentationStatus', {})
        .then((res) => {
          if (res) {
            if (Array.isArray(res)) {
              res = res[0]
            }
            if (res.status === 'PresentationNotFound' && !this._isDestroyed) {
              this.$store.commit('resetSlideState')
              this.$router.setCustomBackListener(null)
              this.$store.commit(
                'setSummary',
                this.$store.getters.getCurrentPresentation
              )
              this.$store.commit('setCurrentSummary', null)
              if (!this._isDestroyed) {
                this.$router.goBack()
              }
              // this.$router.go(-1);
              return
            }
            this.$store.commit('setRunningSlideLastModifiedOn', res.runningSlideLastModifiedOn)
            // if(this.$store.getters.getCurrentSlideMetadata && this.$store.getters.getCurrentSlideMetadata.slideType === 'questionTemplate'){
            // this.getCurrentStats()
            this.isShowWelcome = res.showWelcome
            this.statsData = res.stats || {}
            this.connectedUsers = res.connectedUsers
            this.connectedUsersCount = this.connectedUsers
              ? this.connectedUsers.listOfUsers.length
              : 0
            this.responseSubmittedUsers = res.responseSubmittedUsers || []

            this.calculatePendingReponsesPercentage()
            this.activeUsers = res.activeUsers

            // this.responseSubmittedUsers=res.responseSubmittedUsers

            this.showStats = res.showStats
            if (res.showStats === true) {
              this.isShowNextBtnGroup = false
            }
            // }
            if (res.status === 'NewSlide') {
              if (!this.isPause && res.slideObj.slideId !== this.$store.getters.getCurrentSlide.slideId) {
                this.changeCurrentSlide(res.slideObj)
                this.setNextSlideInStore(res.nextSlide)
                // If whiteboard supproted slide type is found then update slide type for safer side(adding it after whiteboard support in svg type slide)
                if (res.slideObj.dependancies.type === 'svgTemplate' || res.slideObj.dependancies.type === 'methodDraw' || res.slideObj.dependancies.type === 'canvasDraw') {
                  this.$store.commit('updateSlideType', { slideId: res.slideObj.slideId, slideType: res.slideObj.dependancies.type })
                }
              }
            }
            if (res.status === 'Modified') {
              if (res.runningSlideLastModifiedBy !== 'mobile') {
                this.$store.commit('setCurrentSlide', res.slideObj)
                this.$store.commit('updateSlideType', { slideId: res.slideObj.slideId, slideType: res.slideObj.dependancies.type })
                eventBus.$emit('slideModifiedEvent')
              }
            }
          }
          if (!this._isDestroyed) {
            setTimeout(() => {
              this.getCurrentPresentationStatus()
            }, this.intervalTime)
          }
        })
        .catch((err) => {
          console.error(err)
          SystemDialog.confirm(
            this.$t('TeacherPresentationMode.unable_to_reach_server'),
            this.$t(
              'TeacherPresentationMode.please_make_sure_you_are_connected_to_the_same_wifi'
            ),
            this.$t('TeacherPresentationMode.try_again'),
            this.$t('TeacherPresentationMode.cancel'),
            (isConfirmed) => {
              if (isConfirmed) {
                this.getCurrentPresentationStatus()
              }
            }
          )
        })
    }
  },
  beforeDestroy () {
    // removing custom back button listener
    this.$router.setCustomBackListener(null)
    this.posthook(this.$store.getters.getActiveSlides[this.slideIndex]).then(
      (res) => {
        // this.$store.commit('resetSlideState')
      }
    )
  },
  destroyed () {
    // this.$store.commit('resetSlideState')
  },
  mounted () {
    // registering custom back button listener
    this.$router.setCustomBackListener(this.customBackListener)

    this.$store.commit('setSlides', [])
    this.getCurrentPresentationDetails().then((res) => {
      if (res) {
        this.prehook(this.$store.getters.getCurrentSlide)
        this.setPluginData(
          this.$store.getters.getCurrentSlideMetadata.slideType
        )
        this.genrateSlideNumbers()
        // this.addActiveIndex();
        // this.createSearchText();
        this.getCurrentPresentationStatus()
        this.SetCurrentPresentationRunningTillDate()
      }
      this.checkSlidesAvailability()
    })
  }
}
</script>
<style lang="scss">

</style>
