<template>
  <div class="warningmodel">
    <topTitle :title="title"></topTitle>
    <div class="warningmodel-content">
      <section class="warningmodel-total">
        <ul class="warningmodel-total-list">
          <li>
            <img class="warningmodel-total-item-image" src="~@/assets/imgs/rsvr1.png">
            <div class="warningmodel-total-item-message">
              <p class="total-item-message-title">小水库总数</p>
              <p><span>223</span>座</p>
            </div>
          </li>
          <li>
            <img class="warningmodel-total-item-image" src="~@/assets/imgs/rsvr2.png">
            <div class="warningmodel-total-item-message">
              <p class="total-item-message-title">有预警模型</p>
              <p><span>210</span>座</p>
            </div>
          </li>
        </ul>
        <div class="warningmodel-total-title">
          <span>统计信息</span>
          <Icon class="warningmodel-total-title-icon" type="md-albums"/>
        </div>
      </section>
      <section class="warningmodel-query-item">
        <span class="query-item-label">行政区划:</span>
        <Select v-model="query.site"
                size="small"
                class="query-item-formItem">
          <Option v-for="item in adcdList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="query-item-label">水库名称:</span>
        <Input v-model="query.name"
               class="query-item-formItem"
               size="small"/>
        <Button type="primary"
                icon="ios-search"
                class="query-item-label"
                size="small">搜索</Button>
      </section>
      <section class="warningmodel-table">
        <Table :columns="columns"
               :data="data"
               :height="tableHeight"
               ref="table"></Table>
      </section>
      <section class="warningmodel-page">
        <Page :total="3"/>
      </section>
    </div>
  </div>
</template>

<script>
import topTitle from '../topTitle'

export default {
  name: 'warningmodel',
  components:{
    topTitle
  },
  data() {
    return {
      title: '预警模型',
      tableHeight: 1,
      query: {
        site: '',
        name: ''
      },
      adcdList: [
        {
          value: '梅河口市',
          label: '梅河口市'
        }
      ],
      columns: [
        {
          title: '水库名称',
          key: 'name',
          width: 150
        },
        {
          title: '预警规则',
          key: 'rule'
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
              }, '重设'),
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
          name: '大河子',
          rule: '超汛限，Z阈 = 11.3m 超设计，Z阈 = 11.3m 漫顶水位，Z阈 = 11.3m'
        },
        {
          name: '罗圈口',
          rule: '超汛限，Z阈 = 11.3m 超设计，Z阈 = 11.3m 漫顶水位，Z阈 = 11.3m'
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

.warningmodel {
  display: flex;
  flex-direction: column;
  height: 100%;
  .warningmodel-content {
    flex: 1;
    padding: $gap;
    display: flex;
    flex-direction: column;
  }

  .warningmodel-total {
    height: $total-height;
    border: 1px solid #e4e4e4;
    margin-bottom: $gap;
    display: flex;
    justify-content: space-between;
  }
  .warningmodel-total-list {
    display: flex;
    li {
      display: flex;
      margin: $total-gap 0 $total-gap 20px;
    }
  }
  .warningmodel-total-item-image {
    width: 120px;
    height: $total-height - $total-gap * 2 - 2;
  }
  .warningmodel-total-item-message {
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
  .warningmodel-total-title {
    font-size: 12px;
    margin: $gap / 2 $gap / 2 0 0;
    span {
      vertical-align: middle;
    }
  }
  .warningmodel-total-title-icon {
    font-size: 14px;
    vertical-align: middle;
  }

  .warningmodel-query-item {
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
  



  .warningmodel-table {
    flex: 1;
    margin-bottom: $gap;
  }

  .warningmodel-page {
    text-align: center;
  }
}
</style>
