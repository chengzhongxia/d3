<template>
  <div class="home">
    <areaChart />
    <stackBar />
    <groupBar />
    <pointsChart />
    <lineChartII />
    <lineChart />
    <pieChart />
  </div>
</template>

<script>
// @ is an alias to /src
import lineChartII from '@/components/lineChartII.vue'
import areaChart from '@/components/areaChart.vue'
import pieChart from '@/components/pieChart.vue'
import lineChart from '@/components/lineChart.vue'
import pointsChart from '@/components/pointsChart.vue'
import groupBar from '@/components/groupBar.vue'
import stackBar from '@/components/stackBar.vue'

export default {
  name: 'Home',
  components: {
    lineChartII,
    lineChart,
    areaChart,
    pieChart,
    pointsChart,
    groupBar,
    stackBar
  }
}
</script>
