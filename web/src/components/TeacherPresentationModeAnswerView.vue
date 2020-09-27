<template>
  <!-- <div class="answer-mode wrap-alt">
    <div
      class="title-alt d-flex align-items-center"
    >
      <i
        @click="back"
        class="mdi mdi-chevron-left pr-3 cursor-pointer mdi-24px pb-1"
      />  Correct answer
    </div>
    <div class="embedded-css">
      <object
        style="width:100%;min-height:70vh;"
        v-if="templatePath != ''"
        :data="templatePath + '?index=' + index + '&templateType=options'"
      />
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
                    @click="back"
                  >
                    <i class="mdi mdi-chevron-left" />
                  </div>
                  <div class="page-title">
                    {{ $t('TeacherPresentationModeAnswerView.correct_answer') }}
                  </div>
                </div>
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <!-- <object
                  style="width:100%;min-height:70vh;"
                  v-if="templatePath != ''"
                  :data="templatePath + '?index=' + index + '&templateType=options'"
                /> -->
                <div v-if="currentComponent && currentComponent !== '' && templateName=='Question'">
                  <component
                    :is="componentLoader"
                    class="row"
                  />
                </div>
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
import { QUESTION_TYPES } from '../utils/Constants'
export default {
  name: 'PresentationSlide',
  props: ['questionProperties', 'questionObject', 'templatePath', 'index', 'templateName'],
  // props: {
  //   questionProperties: {
  //     type: Object,
  //     default: ''
  //   },
  //   questionObject: {
  //     type: Object,
  //     default: () => {
  //       return {}
  //     }
  //   },
  //   templatePath:{
  //     type: String,
  //     default:''
  //   },
  //   index:{
  //     type: Number,
  //     default: 0
  //   }
  // },
  components: {

  },
  data () {
    return {
      QUESTIONTYPE: QUESTION_TYPES,
      currentComponent: ''
    }
  },
  computed: {
    componentLoader () {
      return () => import(`@/components/superPointPlugins/${this.templateName}/${this.currentComponent}.vue`)
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    INIT () {
      this.currentComponent = 'ViewOptions'
    }
  },
  mounted () {
    this.INIT()
  }
}
</script>
