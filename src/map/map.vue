<template>
  <div class="map"></div>
</template>
<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Circle, Fill, Text } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
  export default {
    data() {
      return {
      };
    },
    mounted() {
      let self = this;
      let  { baseUrl, waterBoundary,mapConfig,Basemap }  = KYCFG;
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
      let map = new Map({
        view: new View(mapConfig.mapCfg),
        target: this.$el,
        layers: [
          tdtTerLayer,
          tdtCvaLayer
        ]
      });
      //控制叠加地图显示隐藏
      this.$eventBus.$on("Superposimap", temp=> {
        if(temp.indexOf('行政中心') != -1){
          tdtCvaLayer.setVisible(true)
        }else{
          tdtCvaLayer.setVisible(false)
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
    },
    methods: {},
    destroyed() {
      this.$eventBus.$off('mapType')
      this.$eventBus.$off('Superposimap')
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
