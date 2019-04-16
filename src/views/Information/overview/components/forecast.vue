<template>
  <item-box name="预报降水"
            :list="list"
            @onSelect="onSelect">
    <img class="image" :src="url" alt="预报降水" @click="toLink">
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
      url: require('@/assets/overview/forecast24.jpg'),
      list: [
        { text: '24h', value: 24 },
        { text: '48h', value: 48 },
        { text: '72h', value: 72 }
      ]
    }
  },
  methods: {
    onSelect(item, index) {
      let { list } = this
      this.url = require(`@/assets/overview/forecast${list[index].value}.jpg`)
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
