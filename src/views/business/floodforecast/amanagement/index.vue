<template>
  <div class="amanagement">
    <topTitle :title="title"></topTitle>
    <div class="amanagement-content">
      <section class="amanagement-query-item">
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
        <span class="query-item-label">预报日期:</span>
        <el-date-picker v-model="query.tm"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="mini"
                        class="query-item-label query-item-date">
        </el-date-picker>
        <span class="query-item-label">发布状态:</span>
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
        <Button type="success"
                icon="md-git-compare"
                class="query-item-label"
                size="small">多成果比较</Button>
      </section>
      <section class="amanagement-table">
        <Table :columns="columns"
               :data="data"
               :height="tableHeight"
               ref="table"></Table>
      </section>
      <section class="amanagement-page">
        <Page :total="3"/>
      </section>
    </div>
  </div>
</template>

<script>
import topTitle from '../topTitle'

export default {
  name: 'amanagement',
  components:{
    topTitle
  },
  data() {
    return {
      title: '成果管理',
      tableHeight: 1,
      query: {
        name: '',
        site: '',
        status: '',
        tm: []
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
          title: '预报站点',
          key: 'name',
          width: 150
        },
        {
          title: '成果名称',
          key: 'planName'
        },
        {
          title: '预报开始时间',
          key: 'stm'
        },
        {
          title: '预报结束时间',
          key: 'entm'
        },
        {
          title: '时段长',
          key: 'period'
        },
        {
          title: '发布状态',
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
                  icon: 'ios-paper-outline'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                    click: () => {
                    }
                }
              }, '详细'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'md-analytics'
                },
                on: {
                  click: () => {
                  }
                }
              }, '调洪')
            ])
          }
        }
      ],
      data: [
        {
          name: '兴隆',
          planName: '兴隆三水源新安江预报方案2018.11.29',
          treatment: 1,
          stm: '2018-11-29 08:00',
          entm: '2018-12-05 08:00',
          period: '1小时'
        },
        {
          name: '利民',
          planName: '利民分布式单位线预报方案2018.11.29',
          treatment: 0,
          stm: '2018-11-29 08:00',
          entm: '2018-12-05 08:00',
          period: '1小时'
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

.amanagement {
  display: flex;
  flex-direction: column;
  height: 100%;
  .amanagement-content {
    flex: 1;
    padding: $gap;
    display: flex;
    flex-direction: column;
  }

  .amanagement-total {
    height: $total-height;
    border: 1px solid #e4e4e4;
    margin-bottom: $gap;
    display: flex;
    justify-content: space-between;
  }
  .amanagement-total-list {
    display: flex;
    li {
      display: flex;
      margin: $total-gap 0 $total-gap 20px;
    }
  }
  .amanagement-total-item-image {
    width: 120px;
    height: $total-height - $total-gap * 2 - 2;
  }
  .amanagement-total-item-message {
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
  .amanagement-total-title {
    font-size: 12px;
    margin: $gap / 2 $gap / 2 0 0;
    span {
      vertical-align: middle;
    }
  }
  .amanagement-total-title-icon {
    font-size: 14px;
    vertical-align: middle;
  }

  .amanagement-query-item {
    height: 40px;
    line-height: 38px;
    border: 1px solid #e4e4e4;
    margin-bottom: $gap;
    .query-item-label {
      margin-left: $gap;
      vertical-align: middle;
      height: 24px;
    }
    .query-item-date {
      width: 230px;
    }
    .query-item-formItem {
      vertical-align: middle;
      width: 120px;
      margin-left: 5px;
    }
  }
  
  .amanagement-table {
    flex: 1;
    margin-bottom: $gap;
  }

  .amanagement-page {
    text-align: center;
  }


  // 重置element中datePicker组件样式
  .el-range-editor--mini .el-range-separator, .el-range-editor--mini .el-range__icon {
    line-height: 15px;
  }
}
</style>
