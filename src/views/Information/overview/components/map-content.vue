<template>
  <div class="map-content">
    <div ref="map" class="map"></div>
    <Legend class="legend-rain" :legendList='legendList' gap="1"></Legend>
    <!-- 图例 -->
    <ul class="legend">
      <li>
        <img :src="`${baseUrl}img/${checkList[0].isShow ? `red` : `grey`}.png`">
        <span :class="[checkList[0].isShow ? '' : 'item-grey']"
              @click="changeLegend(0)">漫顶</span>
      </li>
      <li>
        <img :src="`${baseUrl}img/${checkList[1].isShow ? `gold` : `grey`}.png`">
        <span :class="[checkList[1].isShow ? '' : 'item-grey']"
              @click="changeLegend(1)">超设计</span>
      </li>
      <li>
        <img :src="`${baseUrl}img/${checkList[2].isShow ? `blue` : `grey`}.png`">
        <span :class="[checkList[2].isShow ? '' : 'item-grey']"
              @click="changeLegend(2)">超汛限</span>
      </li>
    </ul>
    <!-- 弹框 -->
    <div ref="popup" class="message-box">
      <header class="message-title">{{message.name}}</header>
      <p>{{message.tm}}</p>
      <div class="message-item">
        <span>水位：</span>
        <span>{{$util.convertZ(message.frz)}}m</span>
      </div>
      <div class="message-item">
        <span>入流：</span>
        <span>{{$util.convertQ(message.inq)}}m³/s</span>
      </div>
      <div class="message-item">
        <span>出流：</span>
        <span>{{$util.convertQ(message.otq)}}m³/s</span>
      </div>
      <div class="message-item">
        <span>超警水位：</span>
        <span>{{$util.convertZ(message.warn)}}m</span>
      </div>
    </div>
  </div>
</template>

<script>
import Legend from '@/components/Legendrain'
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import { GeoJSON, WKT } from 'ol/format'
import { Style, Stroke, Circle, Fill, Text, Icon } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
import Overlay from 'ol/Overlay.js'
import layerCreator from '@/utils/map/layerCreator'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import MapHelper from '@/utils/map/mapHelper'

let mapHelper
let flashSource
let loop
export default {
  components:{
    Legend
  },
  data () {
    return {
      map: null,
      baseUrl: process.env.BASE_URL,
      message: {
        name: '',
        tm: '',
        frz: '',
        warn: '',
        inq: '',
        otq: ''
      },
      checkList: [
        { isShow: true, m: '3' },
        { isShow: true, m: '2' },
        { isShow: true, m: '1' }
      ],
      dataList: [],
      legendList:[{
        num: "0.1-1.5",
        color: '#AAEC93'
      }, {
        num: "1.6-6.9",
        color: '#3BB73F'
      }, {
        num: "7.0-14.9",
        color: '#64B9F9'
      }, {
        num: "15-39.9",
        color: '#0302F8'
      }, {
        num: "40-49.9",
        color: '#F701F7'
      }, {
        num: "≥50",
        color: '#78073A'
      }]
    }
  },
  computed: mapGetters('overview', ['warnList']),
  mounted () {
    let { mapConfig, baseUrl, adcdUrl,Basemap} = KYCFG;
    let { warnList, surface, addSurface } = this
    let map = new Map({
      target: this.$refs.map,
      view: new View(mapConfig.mapCfg),
      layers: [
        // 底图
        new Tile({
          source: new XYZ({
            url: `${baseUrl}?T=${Basemap}&x={x}&y={y}&l={z}`
          })
        }),
        // 行政中心
        new Tile({
          source: new XYZ({
            url: `${baseUrl}?T=cva_w&x={x}&y={y}&l={z}`
          })
        }),
        // 行政区划
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: adcdUrl
          }),
          style() {
            return new Style({
              stroke: new Stroke({
                color: 'gold',
                width: 4
              })
            })
          },
          title: '行政区划'
        })
      ],
      overlays: [
        new Overlay({
          id: 'popup',
          element: this.$refs.popup,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          },
          offset:[10, 10]
        })
      ]
    })
    
    this.map = map
    mapHelper = new MapHelper(map)
    // 叠加等值面
    addSurface()

    // 添加闪烁图层
    flashSource = new VectorSource({
      wrapX: false
    })
    map.addLayer(new VectorLayer({
      source: flashSource,
      style: null
    }))
    // 添加要素时触发的事件
    flashSource.on('addfeature', e => {
      let option = {
        '1': '0, 0, 255',
        '2': '255, 215, 0',
        '3': '255, 0, 0'
      }
      let feature = e.feature

      mapHelper.flash(feature, option[feature.getProperties().attribute.m])
    })

    map.on('pointermove', e => {
      if (e.dragging) return

      let overlay = map.getOverlayById('popup')
      let pixel = map.getEventPixel(e.originalEvent)

      if (!map.hasFeatureAtPixel(pixel)) return
      overlay.setPosition(null)
      map.getTarget().style.cursor = ''
      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer.get('title') !== '水库') return
        let item = feature.getProperties().attribute
        this.message = {
          name: item.ennm,
          tm: item.ftm,
          frz: item.rz,
          warn: item.warn,
          inq: item.inq,
          otq: item.otq
        }
        overlay.setPosition(e.coordinate)
        map.getTarget().style.cursor = 'pointer'
      })
    })

    map.on('singleclick', e => {
      let pixel = map.getEventPixel(e.originalEvent)
      let itemArr = []

      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer.get('title') !== '水库') return
        let item = feature.getProperties().attribute
        itemArr.push(item)
      })

      if (itemArr.length === 0) return
      this.CHANGE_FOCUSRES(null)
      this.CHANGE_FOCUSRES(itemArr[0])
      this.$eventBus.$emit('passResdetail', itemArr[0])
    })
  },
  destroyed () {
    clearInterval(loop)
  },
  watch: {
    warnList(value) {
      this.dataList = value
      this.checkList = [
        { isShow: true, m: '3' },
        { isShow: true, m: '2' },
        { isShow: true, m: '1' }
      ]
      this.createPoint(value)
    }
  },
  methods: {
    ...mapMutations('overview', ['CHANGE_FOCUSRES']),
    ...mapActions('overview', ['surface']),
    async addSurface() {
      let { map, surface } = this
      let res = await surface(new Date())
      let data = res.data.result
      let featuresBox = []
      data.forEach(x => {
        let wkt = x.wkt;
        let format = new WKT();
        let feature = format.readFeature(wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        feature.set('attribute', x)
        featuresBox.push(feature)
      })

      map.addLayer(new VectorLayer({
        source: new VectorSource({
          features: featuresBox
        }),
        title: '等值面',
        style: this.defStyle
      }))
    },
    changeLegend(val) {
      let { checkList, dataList } = this
      this.checkList[val].isShow = !checkList[val].isShow
      let arr = []
      let showList = []

      checkList.forEach(({ isShow, m }) => {
        isShow && arr.push(m)
      })
      dataList.forEach(value => {
        if (arr.indexOf(value.m) > -1) {
          showList.push(value)
        }
      })
      this.createPoint(showList)
    },
    // 画水库点
    createPoint(value) {
      let { baseUrl } = this
      let pointLayer = layerCreator.tracinpoint(value, {
        lgtd: 'rsgt',
        lttd: 'rslt',
        title: '水库',
        style(feature) {
          let item = feature.getProperties().attribute
          let option = {
            '1': 'blue',
            '2': 'gold',
            '3': 'red'
          }
          return new Style({
            image: new Icon(({
              src: `${baseUrl}img/${option[item.m]}.png`,
              scale: .7
            })),
            text: new Text({
              text: '●',
              font: 'Normal 24px serif',
              fill: new Fill({
                color: 'rgba(0, 0, 0, .01)'
              })
            })
          })
        }
      })
      
      pointLayer.setZIndex(3)
      this.map.removeLayer(mapHelper.getLayer('水库'))
      this.map.addLayer(pointLayer)


      // 根据当前点生成闪烁边框
      loop && clearInterval(loop)
      loop = setInterval(() => {
        flashSource.clear()
        value.forEach(item => {
          let coor = transform([item.rsgt, item.rslt], 'EPSG:4326', 'EPSG:3857')
          let geometrypt = new Point(coor)
          let feature = new Feature({
            geometry: geometrypt,
            attribute: item
          })
          flashSource.addFeature(feature)
        })
      }, 2000)
    },
    defStyle: function (feature) {
      let colArr = ['#fff', '#cf5a34', '#adda5f', '#fdda5f', '#ddda5f', '#afda5f'];
      let color = 'rgba(0, 0, 0, 0)';
      let MIN = feature.getProperties().attribute.sortNO;
      switch (MIN) {
        case 0:
          color = 'rgba(170, 236, 147, 0.5)';
          break;
        case 1:
          color = 'rgba(59, 183, 63, 0.5)';
          break;
        case 2:
          color = 'rgba(100, 185, 249, 0.5)';
          break;
        case 3:
          color = 'rgba(3, 2, 248, 0.5)';
          break;
        case 4:
          color = 'rgba(247, 1, 247, 0.5)';
          break;
        case 5:
          color = 'rgba(120, 7, 58, 0.5)';
          break;
        default:
          color = 'rgba(170, 236, 147, 0.5)';
      };
      let defStyle = new Style({
        stroke: new Stroke({
          color: color,
          width: 1
        }),
        fill: new Fill({
          color: color
        })
      });
      return defStyle;
    }
  } 
}
</script>

<style scoped lang="scss">
.map-content {
  height: 100%;
  position: relative;
  .legend-rain {
    bottom: 10px;
    left: 10px;
  }
}
.map {
  height: 100%;
}
.legend {
  position: absolute;
  width: 80px;
  height: 100px;
  background-color: #fff;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: 3px;
  li {
    color: white;
    display: flex;
    line-height: 20px;
    img {
      height: 20px;
      width: 20px;
    }
    span {
      font-size: 12px;
      margin-left: 10px;
      color: #000;
      width: 36px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .item-grey {
    color: #E6E6E6;
  }
}

.message-box {
  font-size: 12px;
  color: white;
  width: 140px;
  height: 130px;
  background-color: $opop-color;
  padding: 8px;
  line-height: 20px;
  border-radius: 0 5px 5px 5px;
  box-shadow:1px 1px 5px #222;
  &::before {
    content: '';
    width: 0;
    height: 0;
    display: block;
    border-top: 10px solid white;
    border-right: 10px solid transparent;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.message-title {
  font-size: 14px;
  font-weight: 900;
}
.message-item {
  // display: flex;
  // justify-content: space-between;
}
</style>
