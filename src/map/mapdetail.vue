<template>
  <div class="map"></div>
</template>
<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource, ImageStatic } from 'ol/source'
import { Tile, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Circle, Fill, Text,Icon ,RegularShape} from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
import layerCreator from '@/map/olLib/layerCreator'
import mapHelper from '@/utils/map/mapHelper'
import ImageWMS from 'ol/source/ImageWMS'
  export default {
    data() {
      return {};
    },
    mounted() {
      let self = this;
      let  { baseUrl, adcdUrl,mapConfig,Basemap,riverBoundary, areaUrl }  = KYCFG;
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
      this.$eventBus.$on("SuperposimapDetail", temp=> {
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
      this.$eventBus.$on("mapTypeDetail", e=> {
        tdtTerLayer.setSource(
          new XYZ({
            url: `${baseUrl}?T=${e}&x={x}&y={y}&l={z}` //对应的卫星图层地图包路径
          })
        );
      });

      // 叠加溃坝范围
      let imgLayer = new ImageLayer()
      let mapView = new View(mapConfig.mapCfg)

      //地图实例
      let map = new Map({
        view: mapView,
        target: this.$el,
        layers: [
          tdtTerLayer,
          tdtCvaLayer,
          DistrictLayer,
          imgLayer,
          RiverLayer
        ]
      });
      this.mapUtil = new mapHelper(map);
      //地图描点
      this.$eventBus.$on('resDetaillist',detaillist=>{
        //先清空图层
        let crossSection = this.mapUtil.getLayer("河道断面");
        map.removeLayer(crossSection);

        let vectorsource = new VectorSource({})
        detaillist.forEach(fea => {
          let geometrypt = new Point([fea.lgtd, fea.lttd])
          let feature = new Feature({
            geometry: geometrypt,
            attribute: fea
          })
          vectorsource.addFeature(feature)
        })
        let sectionPointLayer = new VectorLayer({
          source: vectorsource,
          style(feature) {
            let attribute = feature.getProperties().attribute;
            return new Style({
              image: new RegularShape({
                radius1: 7,
                radius2: 0,
                points: 4,
                fill: new Fill({
                    color: 'blue'
                }),
                stroke: new Stroke({
                  color: 'blue', 
                  width: 1.5
                }),
              }),
              text: new Text({
                text: '●',
                font: 'Normal 24px serif',
                fill: new Fill({
                  color: 'rgba(0, 0, 0, .01)'
                })
              })
            })
          },
          title: '河道断面'
        })
        // map.addLayer(sectionPointLayer)
      })
      //划过地图上点
      map.on("pointermove", e => {
        if (e.dragging) {
          return
        }
        let pixel = map.getEventPixel(e.originalEvent)
        if (map.hasFeatureAtPixel(pixel)) {
          map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (layer.get('title') !== '河道断面') return
            map.getTarget().style.cursor = 'pointer'
          })
        } else {
          map.getTarget().style.cursor = 'null'
        }
      })
      //点击地图上点
      map.on("click", e => {
        let pixel = map.getEventPixel(e.originalEvent)
        map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          let attribute =  feature.getProperties().attribute;
          this.$emit('showDetail',attribute);
        });
      })

      // 叠加淹没范围
      this.$eventBus.$on('areaImage', value => {
        let { rsimgfile, eminx, eminy, emaxx, emaxy, lgtd, lttd } = value
        imgLayer.setSource(new ImageStatic({
          url: `${areaUrl}${rsimgfile}`,
          projection: "EPSG:3857",
          imageExtent: [eminx, eminy, emaxx, emaxy]
        }))
        mapView.setCenter([lgtd, lttd])
        mapView.setZoom(12)

        //先清空图层
        map.removeLayer(this.mapUtil.getLayer("溃口点"));
        
        let vectorsource = new VectorSource({})

        let geometrypt = new Point([lgtd, lttd])
        let feature = new Feature({
          geometry: geometrypt,
          attribute: value
        })
        vectorsource.addFeature(feature)
        
        let PointLayer = new VectorLayer({
          source: vectorsource,
          style(feature) {
            let attribute = feature.getProperties().attribute;
            return new Style({
              image: new Circle({
                radius: 10,
                fill: new Fill({color: 'rgba(255, 0, 0, 0.5)'}),
                stroke: new Stroke({color: 'red', width: 1})
              }),
              text: new Text({
                text: '溃',
                fill: new Fill({
                  color: 'white'
                })
              })
            })
          },
          title: '溃口点'
        })
        map.addLayer(PointLayer)
      })
    },
    methods: {},
    destroyed() {
      this.$eventBus.$off('mapType')
      this.$eventBus.$off('Superposimap')
      this.$eventBus.$off('resDetaillist')
      this.$eventBus.$off('riskLinkage')
      this.$eventBus.$off('areaImage')
    }
  };

</script>
<style lang="scss" scoped>
  .map {
    position: absolute;
    width: 868px;
    height: 400px;
  }

</style>
