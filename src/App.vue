<template>
  <home />
</template>

<script>
import Home from './view/home.vue'
export default {
  components: {
    Home
  }
}
</script>

<style lang="scss">
*{
  box-sizing: border-box;
}
html, body{
  width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  // 禁止移动端下拉刷新
  overscroll-behavior-y: contain;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100vw;
  min-height: 80vh;
  overflow: hidden;
  user-select: none;
}
</style>
