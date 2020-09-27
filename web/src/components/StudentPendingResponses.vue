<template>
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
                  <div
                    class="page-title"
                  >
                    {{ $t('StudentPendingResponses.students_left_to_answer') }}
                  </div>
                </div>
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <div v-if="pendingResponses ===0">
                  {{ $t('StudentPendingResponses.no_students_available') }}
                </div>
                <ul
                  id="example-1"
                  class="std-list"
                >
                  <li
                    v-for="item in filteredUsers"
                    :key="item.learnerId"
                  >
                    {{ item.basicInfo.fullName }}
                  </li>
                </ul>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PresentationSlide',
  props: ['filteredUsers', 'pendingResponses'],
  data () {
    return {

    }
  },
  methods: {
    back () {
      this.$emit('back')
    }
  }
}
</script>
