<template>
  <div class="home">
    <Header></Header>
    <Menu></Menu>
    <div class="view busview">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Menu from '@/components/Menu'
export default {
  name: 'home',
  components: {
    Header,
    Menu
  }
}
</script>

<style lang="scss" scoped></style>

