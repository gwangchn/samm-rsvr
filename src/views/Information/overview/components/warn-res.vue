<template>
  <item-box name="预警水库"
            :list="list"
            @onSelect="onSelect"
            class="overview-warnRes">
    <Tabs ref="tabs">
      <TabPane label="列表">
        <Table stripe
               :columns="columns"
               :data="warnList"
               size="small"
               :height="tableHeight"
               @on-row-click="handleClick"></Table>
      </TabPane>
      <TabPane label="文字">
        <ul :style="{ height: `${tableHeight}px` }" class="text-wrap">
          <li v-for="(item, index) in detailList" :key="`detail${index}`">
            <left-bar :color="item.color">
              <header class="text-title">{{item.tm}} {{item.ennm}}</header>
              <section class="text-content">{{item.text}}</section>
            </left-bar>
          </li>
        </ul>
      </TabPane>
    </Tabs>
  </item-box>
</template>

<script>
import itemBox from './item-box'
import leftBar from './left-bar'
import { mapGetters } from 'vuex'
import { getAllDetail } from '@/api/information/overview'
import { mapMutations } from 'vuex'

let now = new Date()
let userinfo = JSON.parse(sessionStorage.getItem('samm-userinfo'))
let option = {
  '1': 'blue',
  '2': 'gold',
  '3': 'red'
}
export default {
  components: {
    itemBox,
    leftBar
  },
  data () {
    return {
      baseUrl: process.env.BASE_URL,
      tableHeight: 0,
      list: [
        { text: '列表', value: 0 },
        { text: '文字', value: 1 }
      ],
      columns: [
        {
          title: '水库名称',
          render: (h, params) => {
            let { baseUrl } = this
            let item = params.row
            
            return h('div', {
              attrs: {
                class: 'table-name-wrap'
              }
            }, [
              h('img', {
                attrs: {
                  src: `${baseUrl}img/${option[item.m]}.png`,
                  class: 'table-name-img'
                }
              }),
              h('span', {
                attrs: {
                  class: 'table-name-text'
                }
              }, item.ennm)
            ])
          }
        },
        {
          title: '超警(m)',
          render: (h, params) => {
            return h('span', this.$util.convertZ(params.row.warn))
          }
        },
        {
          title: '水位(m)',
          render: (h, params) => {
            return h('span', this.$util.convertZ(params.row.rz))
          }
        },
        {
          title: '时间',
          render: (h, params) => {
            return h('span', params.row.ftm.substring(5, 16))
          }
        }
      ],
      detailList: []
    }
  },
  computed: mapGetters('overview', ['warnList']),
  created () {
    this.getDetailData()
  },
  mounted () {
    let { resizeHeight } = this
    resizeHeight()
    this.__resizeHanlder = this.$util.debounce(resizeHeight, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  destroyed () {
    window.removeEventListener('resize', this.__resizeHanlder)
  },
  methods: {
    ...mapMutations('overview', ['CHANGE_FOCUSRES']),
    resizeHeight() {
      this.tableHeight = this.$refs.tabs.$el.parentNode.offsetHeight
    },
    onSelect(item, index) {
      this.$refs.tabs.handleChange(index)
    },
    async getDetailData() {
      let res = await getAllDetail({
        dscdflage: userinfo.dscdflage,
        f: userinfo.f,
        startDate: new Date(now).formatDate('yyyy-MM-dd HH:00:00'),
        endDate: new Date(now).datePro('{%d+7}').formatDate('yyyy-MM-dd HH:00:00')
      })
      let data = res.data.result
      data.forEach(value => {
        value.color = option[value.m]
        value.tm = value.ftm.substring(0, 16)
      })
      this.detailList = data
    },
    handleClick(val) {
      this.CHANGE_FOCUSRES(null)
      this.CHANGE_FOCUSRES(val)
      this.$eventBus.$emit('passResdetail', val)
    }
  }
}
</script>

<style lang="scss">
  .overview-warnRes {
    .ivu-tabs-bar {
      display: none;
    }
    .text-wrap {
      height: 100%;
      background-color: white;
      padding: 0 10px;
      overflow-y: auto;
      li {
        padding: 5px 0;
      }
    }
    .text-title {
      border-bottom: 1px dashed black;
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      font-weight: bold;
    }
    .text-content {
      font-size: 13px;
      line-height: 22px;
    }
    .table-name-wrap {
      line-height: 20px;
      height: 20px;
      white-space: nowrap;
    }
    .table-name-img {
      vertical-align: middle;
      display: inline-block;
      width: 20px;
      height: 20px;
    }
    .table-name-text {
      vertical-align: middle;
      display: inline-block;
    }
  }
</style>
