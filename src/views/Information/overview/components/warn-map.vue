<template>
  <item-box name="预警分布">
    <section class="overview-warnMap">
      <map-content class="overview-warnMap-map"></map-content>
      <ul class="overview-warnMap-message">
        <li>
          <left-bar color="red">
            <header class="text-title message-real">漫顶 {{overTotal}}</header>
            <section class="message-list">
              <span v-for="(item, index) in overList"
                    :key="'realList' + index">{{item.dsnm}}({{item.total}})</span>
            </section>
          </left-bar>
        </li>
        <li>
          <left-bar color="gold">
            <header class="text-title message-forecast">超设计 {{foreTotal}}</header>
            <section class="message-list">
              <span v-for="(item, index) in foreList"
                    :key="'foreList' + index">{{item.dsnm}}({{item.total}})</span>
            </section>
          </left-bar>
        </li>
        <li>
          <left-bar color="blue">
            <header class="text-title message-overtop">超汛限 {{realTotal}}</header>
            <section class="message-list">
              <span v-for="(item, index) in realList"
                    :key="'overList' + index">{{item.dsnm}}({{item.total}})</span>
            </section>
          </left-bar>
        </li>
      </ul>
    </section>
  </item-box>
</template>

<script>
import itemBox from './item-box'
import leftBar from './left-bar'
import mapContent from './map-content'
import { getStatistics } from '@/api/information/overview'

let now = new Date()
let userinfo = JSON.parse(sessionStorage.getItem('samm-userinfo'))
export default {
  components: {
    itemBox,
    leftBar,
    mapContent
  },
  data () {
    return {
      realTotal: 0,
      foreTotal: 0,
      overTotal: 0,
      realList: [],
      foreList: [],
      overList: []
    }
  },
  async created () {
    let res = await getStatistics({
      dscdflage: userinfo.dscdflage,
      f: userinfo.f,
      startDate: new Date(now).formatDate('yyyy-MM-dd HH:00:00'),
      endDate: new Date(now).datePro('{%d+7}').formatDate('yyyy-MM-dd HH:00:00')
    })
    let data = res.data.result

    this.realList = data[1] ? data[1] : []
    this.foreList = data[2] ? data[2] : []
    this.overList = data[3] ? data[3] : []
    this.realList.forEach(({ total }) => {
      this.realTotal += total
    })
    this.foreList.forEach(({ total }) => {
      this.foreTotal += total
    })
    this.overList.forEach(({ total }) => {
      this.overTotal += total
    })
  }
}
</script>

<style scoped lang="scss">
$bg-color: rgba(36, 75, 139, 0.6);

.overview-warnMap {
  height: 100%;
  display: flex;
  position: relative;
}
.overview-warnMap-map {
  flex: 1;
}
.overview-warnMap-message {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 3px;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 220px;
  height: 200px;
  font-size: 14px;
  padding: 0 10px;
  overflow-y: auto;
  li {
    padding: 10px 0;
  }
}
.text-title {
  border-bottom: 1px dashed black;
  font-size: 14px;
  font-weight: bold;
  height: 22px;
  line-height: 22px;
}
.message-list {
  display: flex;
  flex-wrap: wrap;
  span {
    width: 50%;
    line-height: 22px;
    font-size: 12px;
    color: #666666;
  }
}
.message-real {
  color: red;
}
.message-forecast {
  color: gold;
}
.message-overtop {
  color: blue;
}
</style>
