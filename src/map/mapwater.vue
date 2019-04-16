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
  import mapHelper from '@/utils/map/mapHelper'
  import ImageWMS from 'ol/source/ImageWMS'
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {};
    },
    mounted() {
      let self = this;
      let  { baseUrl,adcdUrl, mapConfig,Basemap,riverBoundary }  = KYCFG;
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
            id: 'popup',
            element:document.getElementById('popWater'),
            autoPan: true,
            autoPanAnimation: {
              duration: 250
            },
            offset:[5,10]
          })
        ]
      });
      this.mapUtil = new mapHelper(map);
      //描雨量站点
      this.$eventBus.$on('passWaterlist',waterList=>{
        //先清空图层
        let waterStation = this.mapUtil.getLayer("水情雨量站");
        map.removeLayer(waterStation);
        map.addLayer(layerCreator.tracinpoint(waterList, '水情雨量站', feature=>{
          let attribute = feature.getProperties().attribute;
          let imgType = '',scale = '';
          if(attribute.sttp == 'ZZ'){
            imgType = 'swzleg_red';
            scale = 1
          }else{
            imgType = 'ssleg';
            scale = 1
          }
          return new Style({
            image: new Icon(({
              src: `${process.env.BASE_URL}img/${imgType}.png`,
              scale: scale
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
            //   text: `${attribute.stnm.trim()}` ,
            //   offsetX: 15,
            //   offsetY: 15
            // })
          })
        }));
      })
      //划过地图上点
      map.on("pointermove", e => {
        if (e.dragging) {
          return
        }
        let overlay = map.getOverlayById('popup')
        let pixel = map.getEventPixel(e.originalEvent)
        if (map.hasFeatureAtPixel(pixel)) {
          map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (layer.get('title') !== '水情雨量站') return
            let attribute = feature.getProperties().attribute;
            this.$emit('popWaterData',{
              name: attribute.stnm.trim(),
              z : self.$util.convertZ(attribute.rz),
              inq: self.$util.convertQ(attribute.inq),
              otq: self.$util.convertQ(attribute.otq),
              sttp:attribute.sttp
            })
            overlay.setPosition(e.coordinate)
            map.getTarget().style.cursor = 'pointer'
          })
        } else {
          overlay.setPosition(null)
           map.getTarget().style.cursor = ''
        }
      })
      //点击地图上点
      map.on("click", e => {
        let pixel = map.getEventPixel(e.originalEvent)
        let itemArr = []

        map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          if (layer.get('title') !== '水情雨量站') return
          let item = feature.getProperties().attribute
          itemArr.push(item)
        });

        if (itemArr.length === 0) return
        let attribute = itemArr[0]
        
        this.$emit('showModal', attribute)
        if (attribute.type == 'Y') {
          self.getStationforeVuex(attribute)
        } else {
          self.getStationliveVuex(attribute)
        }
      })
      //点击左侧table联动控制地图上点
      this.$eventBus.$on("waterLinkage",x=>{
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
    methods: {
      ...mapActions('water',['getStationforeVuex','getStationliveVuex'])
    },
    computed: {},
    destroyed() {
      this.$eventBus.$off('mapType')
      this.$eventBus.$off('Superposimap')
      this.$eventBus.$off('passWaterlist')
      this.$eventBus.$off('waterLinkage')
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
