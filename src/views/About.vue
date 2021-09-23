<template>
  <div class="about">
    <stack-bar />
    <lineChartII />
    <areaChart />
    <lineChart />
    <barChart />
    <pieChart />
  </div>
</template>

<script>
// @ is an alias to /src
import barChart from '@/comp/barChart.vue'
import areaChart from '@/comp/areaChart.vue'
import pieChart from '@/comp/pieChart.vue'
import lineChart from '@/comp/lineChart.vue'
import lineChartII from '@/comp/lineChartII.vue'
import stackBar from '@/comp/stackBar.vue'

export default {
  name: 'about',
  components: {
    barChart,
    areaChart,
    pieChart,
    lineChart,
    lineChartII,
    stackBar,
  }
}
</script>
