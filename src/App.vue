<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">首页</router-link>
      <router-link to="/about">about</router-link> -->
      <router-link to="/3dbar">3d柱形图</router-link>
      <router-link to="/area">面积图</router-link>
      <router-link to="/bar">柱形图</router-link>
      <router-link to="/group-bar">组合柱形图</router-link>
      <router-link to="/pie">饼图/环形图</router-link>
      <router-link to="/nightingale">南丁格尔图</router-link>
      <router-link to="/3dDonut">3d饼图</router-link>
      <router-link to="/line">线状图</router-link>
      <router-link to="/lineII">线状图II</router-link>
      <router-link to="/points">散点图</router-link>
      <router-link to="/stack-bar">堆状柱形图</router-link>
      <router-link to="/radius-stack-bar">径向堆叠柱形图</router-link>
      <router-link to="/stackLineArea">折线堆叠面积图</router-link>
      <router-link to="/chord">弦图</router-link>
      <router-link to="/radar">雷达图</router-link>
      <router-link to="/map">中国地图</router-link>
      <router-link to="/force">力向导图</router-link>
    </div>
    <router-view />
  </div>
</template> 

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}

#nav {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  word-break: keep-all;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
