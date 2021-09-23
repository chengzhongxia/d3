import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: home,
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('@/views/About.vue'),
  // },
  {
    path: '/',
    redirect:'/area'
  },
  {
    path: '/area',
    name: 'area',
    component: () => import('@/components/areaChart.vue'),
  },
  {
    path: '/bar',
    name: 'bar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/components/barChart.vue'),
  },
  { path: '/group-bar', name: 'group-bar', component: () => import('@/components/groupBar.vue') },
  {
    path: '/pie',
    name: 'pie',
    component: () => import('@/components/pieChart.vue'),
  },
  {
    path: '/nightingale',
    name: 'nightingale',
    component: () => import('@/components/nightingale.vue'),
  },
  {
    path: '/line',
    name: 'line',
    component: () => import('@/components/lineChart.vue'),
  },
  {
    path: '/lineII',
    name: 'lineII',
    component: () => import('@/components/lineChartII.vue'),
  },
  {
    path: '/points',
    name: 'points',
    component: () => import('@/components/pointsChart.vue'),
  },
  {
    path: '/stack-bar',
    name: 'stack-bar',
    component: () => import('@/components/stackBar.vue'),
  },
  { path: '/radius-stack-bar', name: 'radiusStackBar', component: () => import('@/components/radiusStackBar.vue') },
  { path: '/chord', name: 'chord', component: () => import('@/components/chord.vue') },
  { path: '/stackLineArea', name: 'stackLineArea', component: () => import('@/components/stackLineArea.vue') },
  { path: '/radar', name: 'radar', component: () => import('@/components/radar.vue') },
  { path: '/map', name: 'map', component: () => import('@/components/map.vue') },
  { path: '/force', name: 'force', component: () => import('@/components/force.vue') },
  { path: '/3dDonut', name: '3dDonut', component: () => import('@/components/3dDonut.vue') },
]

const router = new VueRouter({
  routes,
})

export default router
