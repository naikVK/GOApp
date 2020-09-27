<template>
  <!-- <div class="response-list"> -->
  <!-- <h1>{{ displayText }}</h1> -->

  <!-- <div
      v-for="(option, index) in learnerList"
      :key="index"
    >
      {{ index }}. {{ option.basicInfo.fullName }}
    </div> -->

  <!-- <button
      class="btn btn-blue"
      @click="close"
    >
      Close
    </button> -->
  <!-- <div
      class="Students wrap-alt"
    >
      <div class="page-action">
        <div
          class="close"
          @click="close"
        >
          <i class="mdi mdi-chevron-left" />
        </div>
        <div class="page-title">
          {{ displayText }}
        </div>
      </div> -->
  <!-- <div
        class="page-action"
      >
        <i
          @click="close"
          class="mdi mdi-chevron-left"
        />   {{ displayText }}
      </div> -->
  <!-- <div
        v-for="(option, index) in learnerList"
        :key="index"
      >
        <div class="row student-list align-items-center">
          <div class="col-auto"> -->
  <!-- use below code to show images -->
  <!-- <img
              src="../../public/assets/images/avatars/team14.jpg"
              class="list-img"
            > -->

  <!-- show below class for respective answers -->
  <!-- <div class="first-letter correct">
              <div class="first-letter incorrect"> -->
  <!-- <div class="first-letter dontknow">
              <span>L</span>
            </div>
          </div>
          <div class="col">
            <div class="main-text">
              {{ option.basicInfo.fullName }}
            </div>
            <div class="sub-text">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <transition
    name="slide-fade"
    mode="out-in"
  >
    <div class="modal-mask modal-primary">
      <div class="modal-wrapper">
        <div class="modal-holder">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
                <div class="page-action">
                  <div
                    class="icon-close"
                    @click="close"
                  >
                    <i class="mdi mdi-chevron-left" />
                  </div>
                  <div class="page-title">
                    {{ displayText }}
                  </div>
                </div>
              </slot>
            </div>
            <div class="modal-body">
              <slot
                name="body"
                v-if="learnerList.length && learnerList.length > 0"
              >
                <div
                  v-for="(option, index) in learnerList"
                  :key="index"
                >
                  <div class="row student-list align-items-center">
                    <div class="col-auto">
                      <!-- use below code to show images -->
                      <img
                        v-if="option.basicInfo.imgPath !== ''"
                        :src="getProfileImg(option.basicInfo.imgPath)"
                        class="list-img"
                      >

                      <!-- show below class for respective answers -->
                      <!-- <div class="first-letter correct">
              <div class="first-letter incorrect"> -->
                      <div
                        :class="'first-letter ' + dynamicClass"
                        v-else
                      >
                        <span>{{ option.basicInfo.fullName.charAt(0).trim().toUpperCase() }}</span>
                      </div>
                    </div>
                    <div class="main-text-holder">
                      <div class="main-text">
                        {{ option.basicInfo.fullName }}
                      </div>
                      <div class="sub-text">
                        <!-- F Y Comp - A -->
                      </div>
                    </div>
                  </div>
                </div>
              </slot>
              <slot
                name="body"
                v-else
              >
                {{ $t('LearnerListPage.no_learners_found') }}
              </slot>
            </div>
            <!-- <div class="modal-footer">
              <slot name="footer">
              <button class="modal-default-button" >
                  OK
                </button>
                <button
                  class="btn btn-defaultblue-rounded"
                  @click="close"
                >
                  Cancel
                </button>
              </slot>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ClassroomModes } from '../utils/Constants.js'
import Configs from '../utils/Configs'

export default {
  props: {
    learnerList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    displayText: {
      type: String,
      required: true,
      default: ''
    },
    dynamicClass: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    close () {
      this.$emit('closeLearnerListView')
    },
    getProfileImg (imgPath) {
      if (this.$store.getters.classroomMode === ClassroomModes.offline) {
        return Configs.getLocalUrl() + '/o/assetfdb/' + imgPath
      } else {
        return Configs.getOnlineClassroomURL() + '/o/assetfdb/' + imgPath
      }
    }
  }
}
</script>
