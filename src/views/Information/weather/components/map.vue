<template>
  <div class="map"></div>
</template>
<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource, ImageStatic } from 'ol/source'
import { Tile, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Circle, Fill, Text } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { transformExtent } from 'ol/proj'
import { mapGetters } from 'vuex'
import ImageWMS from 'ol/source/ImageWMS'

  export default {
    data() {
      return {
      };
    },
    computed: mapGetters('weather', [
      'type',
      'extent',
      'host',
      'listMap'
    ]),
    mounted() {
      let self = this;

      let  { baseUrl, waterBoundary, mapConfig, adcdUrl,Basemap ,riverBoundary}  = KYCFG;

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

      let adcdLayer = new VectorLayer({ // 行政区划
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

      // 叠加云图和雷达图
      let imgLayer = new ImageLayer()

      let map = new Map({
        view: new View(mapConfig.mapCfg),
        target: this.$el,
        layers: [
          tdtTerLayer,
          tdtCvaLayer,
          adcdLayer,
          imgLayer,
          RiverLayer
        ]
      });
      adcdLayer.setZIndex(99)
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
      // 地图上叠加云图或雷达图
      this.$eventBus.$on('addImg', res => {
        let { type, extent, host, listMap } = this
        let date = new Date(res).formatDate('yyyyMMddHHmmss')
        let url = listMap[date]
        let source = null
        if (url) {
          source = new ImageStatic({
            url: `${host}${url}`,
            projection: "EPSG:3857",
            imageExtent: transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
          })
        }
        imgLayer.setSource(source)
      })
    },
    methods: {},
    destroyed() {
      this.$eventBus.$off('mapType')
      this.$eventBus.$off('Superposimap')
      this.$eventBus.$off('addImg')
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
