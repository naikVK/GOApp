<template>
  <div
    class="game-slide"
    id="gameTemplate"
  >
    <section>
      <!-- <object
        v-if="templatePath != ''"
        width="100%"
        :id="'gameTemplateHtmlHolder'"
        :data="templatePath + '?index=' + index + '&templateType=presentation' + '&slidePosition=' + slidePosition"
      /> -->
      <div v-if="currentComponent && currentComponent !== ''">
        <component
          :is="componentLoader"
          :slide-position="slidePosition"
          :index="index"
        />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'GameTemplate',
  props: {
    templatePath: {
      type: String,
      default: ''
    },
    slidePosition: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    templateName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      slidePath: this.templatePath,
      currentComponent: ''
    }
  },
  computed: {
    componentLoader () {
      return () => import(`@/components/superPointPlugins/${this.templateName}/${this.currentComponent}.vue`)
    }
  },
  methods: {
    INIT () {
      this.currentComponent = this.templateName + 'Presentation'
    }
  },
  mounted () {
    this.INIT()
  }
}
</script>
