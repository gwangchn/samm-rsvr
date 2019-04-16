<template>
  <item-box name="实时降水"
            :list="list"
            @onSelect="onSelect">
    <img class="image" :src="url" alt="实时降水" @click="toLink">
  </item-box>
</template>

<script>
import itemBox from './item-box'

export default {
  components: {
    itemBox
  },
  data () {
    return {
      url: require('@/assets/overview/real1.jpg'),
      list: [
        { text: '1h', value: 1 },
        { text: '6h', value: 6 },
        { text: '24h', value: 24 }
      ]
    }
  },
  methods: {
    onSelect(item, index) {
      let { list } = this
      this.url = require(`@/assets/overview/real${list[index].value}.jpg`)
    },
    toLink() {
      this.$router.push('rain')
    }
  }
}
</script>

<style scoped lang="scss">
.image {
  width: 100%;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
}
</style>
