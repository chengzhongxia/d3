<template>
  <div>

  </div>
</template>
<script>
import * as d3 from 'd3'
export default {
  data () {
    return {
      dataset: [
        { id: 1, name: '遂昌县', rise: 3, unit: '%' },
        { id: 2, name: '龙泉市', rise: 2, unit: '%' },
        { id: 3, name: '松阳县', rise: 4, unit: '%' },
        { id: 4, name: '云和县', rise: 2, unit: '%' },
        { id: 5, name: '庆元县', rise: 3, unit: '%' },
        { id: 6, name: '青田县', rise: 4, unit: '%' },
        { id: 7, name: '莲都区', rise: 2, unit: '%' },
        { id: 8, name: '景宁县', rise: 6, unit: '%' },
        { id: 9, name: '缙云县', rise: 2, unit: '%' },
      ]
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
     

    }
  },
}
</script>
