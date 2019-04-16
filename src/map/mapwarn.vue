<template>
  <div class="map"></div>
</template>
<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Circle, Fill, Text,Icon } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
import Overlay from 'ol/Overlay.js'
import layerCreator from '@/map/olLib/layerCreator'
import MapHelper from '@/utils/map/mapHelper'
import ImageWMS from 'ol/source/ImageWMS'

let loop ,flashSource,mapHelper
  export default {
    data() {
      return {};
    },
    mounted() {
      let self = this;
      let  { baseUrl, adcdUrl,mapConfig,Basemap,riverBoundary }  = KYCFG;
      let tdtCvaLayer =new Tile({//行政中心
        visible: true,
        source: new XYZ({
          url: `${baseUrl}?T=cva_w&x={x}&y={y}&l={z}`
        })
      });
      let tdtTerLayer =new Tile({//底图
        visible: true,
        source: new XYZ({
          url: `${baseUrl}?T=${Basemap}&x={x}&y={y}&l={z}`
        })
      });
      //行政区划
      let DistrictLayer = new VectorLayer({
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

      // 河流水系
      let RiverLayer = new ImageLayer({
        visible: false,
        source: new ImageWMS({
          params: {'LAYERS': 'kytx:mhkriver','version':'1.1.0'},
          url: riverBoundary
        }),
        title: '河流水系'
      })
      
      //控制叠加地图显示隐藏
      this.$eventBus.$on("Superposimap", temp=> {
        if(temp.indexOf('行政中心') != -1){
          tdtCvaLayer.setVisible(true)
        }else{
          tdtCvaLayer.setVisible(false)
        }
        if(temp.indexOf('河流水系') != -1){
          RiverLayer.setVisible(true)
        }else{
          RiverLayer.setVisible(false)
        }
      });
      //切换底图
      this.$eventBus.$on("mapType", e=> {
        tdtTerLayer.setSource(
          new XYZ({
            url: `${baseUrl}?T=${e}&x={x}&y={y}&l={z}` //对应的卫星图层地图包路径
          })
        );
      });
      //地图实例
      let map = new Map({
        view: new View(mapConfig.mapCfg),
        target: this.$el,
        layers: [
          tdtTerLayer,
          tdtCvaLayer,
          DistrictLayer,
          RiverLayer
        ],
        overlays: [
          new Overlay({
            id: 'popupW',
            element:document.getElementById('popWarning'),
            autoPan: true,
            autoPanAnimation: {
              duration: 250
            },
            offset:[5,10]
          })
        ]
      });
      mapHelper = new MapHelper(map);
      // 添加闪烁图层
      flashSource = new VectorSource({
        wrapX: false
      })
      map.addLayer(new VectorLayer({
        source: flashSource,
        style:null
      }))
      // 添加要素时触发的事件
      flashSource.on('addfeature', e => {
        let option = {
          '1': '0, 0, 255',
          '2': '255, 215, 0',
          '3': '255, 0, 0'
        }
        let feature = e.feature;
        mapHelper.flash(feature, option[feature.getProperties().attribute.m])
      })
      //地图描点
      this.$eventBus.$on('passWarnlist',warnList=>{
        //先清空图层
        let warnStation = mapHelper.getLayer("预警雨量站");
        map.removeLayer(warnStation);
        map.addLayer(layerCreator.tracinpoint(warnList, '预警雨量站', feature=>{
          let attribute = feature.getProperties().attribute;
          let option = {
            '1': 'blue',
            '2': 'gold',
            '3': 'red'
          }
          return new Style({
            image: new Icon(({
              src: `${process.env.BASE_URL}img/${option[attribute.m]}.png`,
              scale: .6
            })),
            text: new Text({
              text: '●',
              font: 'Normal 24px serif',
              fill: new Fill({
                color: 'rgba(0, 0, 0, .01)'
              })
            }),
            // text: new Text({
            //   font: "12px 微软雅黑,sans-serif",
            //   fill: new Fill({
            //     color: 'rgba(255, 255, 255,1)'
            //   }),
            //   text: `${attribute.ennm}` ,
            //   offsetX: 15,
            //   offsetY: 15
            // })
          })
        }));
        // 根据当前点生成闪烁边框
        loop && clearInterval(loop)
        loop = setInterval(() => {
          flashSource.clear()
          warnList.forEach(item => {
            let coor = transform([item.lgtd, item.lttd], 'EPSG:4326', 'EPSG:3857')
            let geometrypt = new Point(coor)
            let feature = new Feature({
              geometry: geometrypt,
              attribute: item
            })
            flashSource.addFeature(feature)
          })
        }, 2000)
      })
      //划过地图上点
      map.on("pointermove", e => {
        if (e.dragging) {
          return
        }
        let overlay = map.getOverlayById('popupW')
        let pixel = map.getEventPixel(e.originalEvent)
        if (map.hasFeatureAtPixel(pixel)) {
          map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (layer.get('title') !== '预警雨量站') return
            let attribute = feature.getProperties().attribute;
            this.$emit('popWarningData',{
              name: attribute.ennm.trim(),
              ftm : attribute.ftm,
              rz : self.$util.convertZ(attribute.rz),
              inq: self.$util.convertQ(attribute.inq),
              otq: self.$util.convertQ(attribute.otq),
              warn: self.$util.convertZ(attribute.warn)
            })
            overlay.setPosition(e.coordinate)
            map.getTarget().style.cursor = 'pointer'
          })
        } else {
          map.getTarget().style.cursor = 'null'
          overlay.setPosition(null)
        }
      })
      //点击地图上点
      map.on("click", e => {
        let pixel = map.getEventPixel(e.originalEvent)
        map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          let attribute =  feature.getProperties().attribute;
          this.$emit('showWarnDetails',attribute);
        });
      })
      //点击左侧table联动控制地图上点
      this.$eventBus.$on("warningLinkage",x=>{
        let coor = transform([x.lgtd,x.lttd], 'EPSG:4326', 'EPSG:3857');
        //移动视图居中
        map.setView(
          new View({
            center: coor,
            zoom: mapConfig.mapCfg.tempzoom
          })
        );
      });
    },
    methods: {},
    destroyed() {
      clearInterval(loop)
      this.$eventBus.$off('mapType')
      this.$eventBus.$off('Superposimap')
      this.$eventBus.$off('passWarnlist')
      this.$eventBus.$off('warningLinkage')
    }
  };

</script>
<style lang="scss" scoped>
  .map {
    position: absolute;
    height: calc(100vh - #{$header-height});;
    width: calc(100vw - #{$menu-width});
    top: $header-height;
    left: $menu-width;
  }

</style>
