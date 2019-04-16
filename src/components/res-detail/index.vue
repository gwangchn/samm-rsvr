<template>
  <Modal class="common-resDetail"
         width="900"
         v-model="isShow"
         :title="title">
    <p>{{description}}</p>
    <Tabs>
      <TabPane label="雨洪">
        <rain></rain>
      </TabPane>
      <TabPane label="风险">
        <risk></risk>
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script>
import rain from './rain'
import risk from './risk'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'res-detail',
  components: {
    rain,
    risk
  },
  data () {
    return {
      isShow: false,
      title: '水库',
      description: ''
    }
  },
  computed: mapGetters('resDetail', ['ennmcd']),
  watch: {
    async ennmcd(value) {
      if (!value) {
        this.isShow = false
        return
      }

      this.isShow = true

      let now = new Date()
      
      this.getRainfall({
        date: now,
        vm: this
      })

      let res = await this.getInfo(now)
      let { ennm, text } = res.data.result;
      this.title = ennm
      this.description = text
    },
    isShow(value) {
      this.CHANGE_SHOWFLAG(value)
    }
  },
  mounted() {
    this.$eventBus.$on('passResdetail', res => {
      this.CHANGE_ENNMCD(null)
      this.$nextTick(() => {
        this.CHANGE_ENNMCD(res.ennmcd)
      })
    })
    //this.$eventBus.$emit('passResdetail', 1)
  },
  methods: {
    ...mapMutations('resDetail', ['CHANGE_ENNMCD', 'CHANGE_SHOWFLAG']),
    ...mapActions('resDetail', ['getInfo', 'getRainfall'])
  },
  beforeDestroy () {
    this.$eventBus.$off('passResdetail')
  }
}
</script>

<style lang="scss">
.common-resDetail {
  .ivu-tabs-bar {
    margin-bottom: 0;
  }
}
</style>

