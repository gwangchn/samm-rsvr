<template>
  <div class="autosetting">
    <topTitle :title="title"></topTitle>
    <div class="autosetting-content">
      <section class="autosetting-total">
        <ul class="autosetting-total-list">
          <li>
            <img class="autosetting-total-item-image" src="~@/assets/imgs/rsvr1.png">
            <div class="autosetting-total-item-message">
              <p class="total-item-message-title">小水库总数</p>
              <p><span>223</span>座</p>
            </div>
          </li>
          <li>
            <img class="autosetting-total-item-image" src="~@/assets/imgs/rsvr2.png">
            <div class="autosetting-total-item-message">
              <p class="total-item-message-title">支持滚动预报</p>
              <p><span>220</span>座</p>
            </div>
          </li>
        </ul>
        <div class="autosetting-total-title">
          <span>统计信息</span>
          <Icon class="autosetting-total-title-icon" type="md-albums"/>
        </div>
      </section>
      <section class="autosetting-query-item">
        <span class="query-item-label">行政区划:</span>
        <Select v-model="query.name"
                size="small"
                class="query-item-formItem">
          <Option v-for="item in adcdList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="query-item-label">预报站点:</span>
        <Input v-model="query.site"
               class="query-item-formItem"
               size="small"/>
        <span class="query-item-label">运行状态:</span>
        <Select v-model="query.status"
                size="small"
                class="query-item-formItem">
          <Option v-for="item in statusList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary"
                icon="ios-search"
                class="query-item-label"
                size="small">搜索</Button>
      </section>
      <section class="autosetting-table">
        <Table :columns="columns"
               :data="data"
               :height="tableHeight"
               ref="table"></Table>
      </section>
      <section class="autosetting-page">
        <Page :total="3"/>
      </section>
    </div>
  </div>
</template>

<script>
import topTitle from '../topTitle'

export default {
  name: 'autosetting',
  components:{
    topTitle
  },
  data() {
    return {
      title: '自动设置',
      tableHeight: 1,
      query: {
        name: '',
        site: '',
        status: ''
      },
      adcdList: [
        {
          value: '梅河口市',
          label: '梅河口市'
        }
      ],
      statusList: [
        {
          value: '1',
          label: '已启用'
        },
        {
          value: '0',
          label: '已暂停'
        }
      ],
      columns: [
        {
          title: '水库名称',
          key: 'name',
          width: 150
        },
        {
          title: '预报方案',
          key: 'plan'
        },
        {
          title: '预热期',
          key: 'warmUp'
        },
        {
          title: '时段长',
          key: 'period'
        },
        {
          title: '预见期',
          key: 'forecastPeriod'
        },
        {
          title: '自动预报顺序',
          key: 'order'
        },
        {
          title: '服务开始时间',
          key: 'tm',
          width: 150
        },
        {
          title: '服务滚动时间',
          key: 'scroll'
        },
        {
          title: '运行状态',
          render: (h, params) => {
            return h('i-switch', { //数据库1是已处理，0是未处理
              props: {
                size: 'small',
                type: 'primary',
                value: params.row.treatment === 1  //控制开关的打开或关闭状态，官网文档属性是value
              },
              on: {
                'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                          //参数value是回调值，并没有使用到
                  // this.switch(params.index) //params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            }, )
          }
        },
        {
          title: '操作',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-create-outline'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                    click: () => {
                    }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash-outline'
                },
                on: {
                  click: () => {
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [
        {
          name: '二道河子',
          treatment: 1,
          plan: '三水源新安江',
          warmUp: '3天',
          period: '1小时',
          forecastPeriod: '168小时',
          order: '1',
          tm: '2018-01-02 08:00',
          scroll: '1分钟'
        }
      ]
    }
  },
  mounted () {
    this.tableHeight = this.$refs.table.$el.parentNode.clientHeight
  }
}
</script>
                     
<style lang="scss">
$gap: 10px;
$total-height: 80px;
$total-gap: 5px;

.autosetting {
  display: flex;
  flex-direction: column;
  height: 100%;
  .autosetting-content {
    flex: 1;
    padding: $gap;
    display: flex;
    flex-direction: column;
  }

  .autosetting-total {
    height: $total-height;
    border: 1px solid #e4e4e4;
    margin-bottom: $gap;
    display: flex;
    justify-content: space-between;
  }
  .autosetting-total-list {
    display: flex;
    li {
      display: flex;
      margin: $total-gap 0 $total-gap 20px;
    }
  }
  .autosetting-total-item-image {
    width: 120px;
    height: $total-height - $total-gap * 2 - 2;
  }
  .autosetting-total-item-message {
    line-height: ($total-height - $total-gap * 2 - 2) / 2;
    margin-left: $total-gap;
    span {
      font-size: 14px;
      font-weight: bold;
      color: $bg-color;
    }
  }
  .total-item-message-title {
    font-size: 14px;
    font-weight: bold;
  }
  .autosetting-total-title {
    font-size: 12px;
    margin: $gap / 2 $gap / 2 0 0;
    span {
      vertical-align: middle;
    }
  }
  .autosetting-total-title-icon {
    font-size: 14px;
    vertical-align: middle;
  }

  .autosetting-query-item {
    height: 40px;
    line-height: 38px;
    border: 1px solid #e4e4e4;
    margin-bottom: $gap;
    .query-item-label {
      margin-left: $gap;
      vertical-align: middle;
    }
    .query-item-formItem {
      vertical-align: middle;
      width: 120px;
      margin-left: 5px;
    }
  }
  



  .autosetting-table {
    flex: 1;
    margin-bottom: $gap;
  }

  .autosetting-page {
    text-align: center;
  }
}
</style>
