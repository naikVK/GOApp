<script>
import { Bubble } from 'vue-chartjs'
import 'chartjs-plugin-annotation'
export default {
  extends: Bubble,
  props: {
    datacollection: {
      type: Object,
      default: () => {
        return {}
      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
  }
}
</script>
