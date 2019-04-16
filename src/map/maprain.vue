<template>
  <div class="map"></div>
</template>
<script>
  import Map from 'ol/Map'
  import View from 'ol/View'
  import { XYZ, Vector as VectorSource } from 'ol/source'
  import { Tile, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
  import { GeoJSON, WKT } from 'ol/format'
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
    computed: {
      ...mapGetters('rain',['gap','Lattice','Isosurface'])
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
            id: 'popup',
            element:document.getElementById('popRain'),
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
      this.$eventBus.$on('passRainlist',rainList=>{
        //先清空图层
        let rainStation = this.mapUtil.getLayer("雨量站");
        map.removeLayer(rainStation);
        let siteLayer = layerCreator.tracinpoint(rainList, '雨量站', feature=>{
          let drp = feature.getProperties().attribute.drp;
          let color = this.getColor(drp,1)
          return new Style({
            text: new Text({
              font: '12px 微软雅黑,sans-serif',
              fill: new Fill({
                color: color
              }),
              text: name,
              offsetX: 10,
              offsetY: -10
            }),
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: color
              })
            })
          })
        });
        siteLayer.setZIndex(99)
        map.addLayer(siteLayer);
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
            if (layer.get('title') !== '雨量站') return
            let item = feature.getProperties().attribute;
            this.$emit('popRainData',{
              name: item.stnm.trim(),
              drp : self.$util.convertP(item.drp),
            });
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
          if (layer.get('title') !== '雨量站') return
          let item = feature.getProperties().attribute
          itemArr.push(item)
        })

        if (itemArr.length === 0) return

        let attribute = itemArr[0]
        this.$emit('showModal', attribute)

        if (attribute.type == 'Y') {
          self.getStationfore(attribute)
        } else {
          self.getStationlive(attribute)
        }
      });
      //点击左侧table联动控制地图上点
      this.$eventBus.$on("rainLinkage",x=>{
        let coor = transform([x.lgtd,x.lttd], 'EPSG:4326', 'EPSG:3857');
        //移动视图居中
        map.setView(
          new View({
            center: coor,
            zoom: mapConfig.mapCfg.tempzoom
          })
        );
      });
      //叠加格点雨量
      this.$eventBus.$on('passLatticeRain',LatticeRain=>{
        //先清空图层
        let GPoint = this.mapUtil.getLayer("格点雨量站");
        map.removeLayer(GPoint);
        let LatticeLayer = layerCreator.tracinCluster(LatticeRain, "格点雨量站", feature => {
          let arr = feature.getProperties().features;
          let sum = 0
          arr.forEach(value => {
            let pp = value.getProperties().attribute.pp;
            sum += pp
          });
          sum = sum.toFixed(1);
          let color = this.getColor(sum, 0.8)
          return new Style({
            text: new Text({
              // font: '12px 微软雅黑,sans-serif',
              fill: new Fill({
                color: 'white'
              }),
              text: sum,
              backgroundFill: new Fill({
                color: color
              }),
              padding: [2, 4, 2, 4]
            }),
            image: new Circle({
              radius: 20,
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.01)'
              })
            })
          })
        });
        LatticeLayer.setVisible(self.Lattice);
        //加载图层
        map.addLayer(LatticeLayer);
      });
      //添加等值面
      this.$eventBus.$on('IsosurfaceLine',data=>{
        //先清空图层
        let Isosurface = this.mapUtil.getLayer("等值面");
        map.removeLayer(Isosurface);
        let featuresBox = [];
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
        let IsosurfaceLayer = new VectorLayer({
          source: new VectorSource({
            features:featuresBox
          }),
          title: '等值面',
          style: this.defStyle
        });
        IsosurfaceLayer.setVisible(self.Isosurface);
        map.addLayer(IsosurfaceLayer);
      })
    },
    methods: {
      getColor(value, opacity = 1) {
        let color = `rgba(204, 204, 204, ${opacity})`
        let arr = null
        switch (Number(this.gap)) {
          case 1:
            arr = [0.1, 1.6, 7, 15, 40, 50]
            break
          case 3:
            arr = [0.1, 3, 10, 20, 50, 70]
            break
          case 6:
            arr = [0.1, 4, 13, 25, 60, 120]
            break
          case 12:
            arr = [0.1, 5, 15, 30, 70, 140]
            break
          case 24:
            arr = [0.1, 10, 25, 50, 100, 250]
            break
          case 72:
            arr = [0.1, 30, 75, 150, 300, 750]
            break
        }
        if (value >= arr[0] && value < arr[1]) {
          color = `rgba(170, 236, 147, ${opacity})`
        } else if (value >= arr[1] && value < arr[2]) {
          color = `rgba(59, 183, 63, ${opacity})`
        } else if (value >= arr[2] && value < arr[3]) {
          color = `rgba(100, 185, 249, ${opacity})`
        } else if (value >= arr[3] && value < arr[4]) {
          color = `rgba(3, 2, 248, ${opacity})`
        } else if (value >= arr[4] && value < arr[5]) {
          color = `rgba(247, 1, 247, ${opacity})`
        } else if (value >= arr[5]) {
          color = `rgba(120, 7, 58, ${opacity})`
        }
        return color
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
      },
      ...mapActions('rain',['getStationfore','getStationlive'])
    },
    destroyed() {
      this.$eventBus.$off('mapType')
      this.$eventBus.$off('Superposimap')
      this.$eventBus.$off('passRainlist')
      this.$eventBus.$off('rainLinkage')
      this.$eventBus.$off('passLatticeRain')
      this.$eventBus.$off('controlLattice')
      this.$eventBus.$off('IsosurfaceLine')
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
