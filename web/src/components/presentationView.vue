<template>
  <div
    class="content-help-wrapper"
    id="presentationView"
  >
    <section>
      <!-- <object
        v-if="slidePath != ''"
        width="100%"
        :id="'presentationViewHtmlHolder'"
        :data="templatePath + '?index=' + index + '&templateType=presentation'  + '&slidePosition=' + slidePosition"
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
  name: 'PresentationView',
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
  // computed: {
  //   templateData () {
  //     return this.slidePath + this.index
  //   },
  //   changedPath () {
  //     return this.templatePath
  //   }
  // },
  // watch: {
  //   templateData: function (newValue, oldValue) {
  //     this.presentationView = document.getElementById('presentationView')
  //     let innerHTMLObj = '<section class="h-100" ><object width="100%" id="presentationViewHtmlHolder" data="' + this.changedPath + '?index=' + this.index + '&templateType=presentation' + '"></object></section>'
  //     this.presentationView.innerHTML = ''
  //     this.presentationView.innerHTML = innerHTMLObj
  //   }
  // }
}
</script>
