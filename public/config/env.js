/**
 * 项目环境配置
 * 在 index.html 中引入
 * 用于解决webpack根据引用，会打包一切被引用资源的问题
 */
(function () {
  "use strict";

  if (!("KYCFG" in window)) {
    var mapUrl = "http://222.128.60.210:9093/geoserver/kytx/";

    window.KYCFG = {
      // 开发环境api 地址
      dapiUrl:'http://192.168.100.106:8080/smallrsvrweb',
      // 生产环境api 地址
      papiUrl: "http://222.128.60.210:9555/api/",
      // 溃坝风险图所路径
      areaUrl: 'http://222.128.60.210:9555/areaImage/',
      // 天地图服务
      baseUrl : "http://t3.tianditu.com/DataServer",
      // 卫星云图
      cloudUrl: "http://222.128.60.210:9555/cloud/",
      // 雷达图
      radarUrl: "http://222.128.60.210:9555/radar/",
      // 梅河口市行政区划
      adcdUrl: mapUrl + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kytx:meihekou&maxFeatures=50&outputFormat=application%2Fjson",
      // 流域边界图层
      waterBoundary: mapUrl + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kytx:pjk_rivers&maxFeatures=500&outputFormat=application%2Fjson",
      // 河流及名字图层
      riverBoundary: mapUrl + "wms?service=WMS&srs=EPSG:3857&format=image%2Fgif",
      // 地图基本配置
      mapConfig: { 
        mapCfg: {
          // 地图投影
          projection: "EPSG:3857",
          // 默认中心点
          center:  [13994093.66503357887268066, 5241431.57366977818310261],
          // 默认缩放等级
          zoom: 9,
          // 联动定位站点
          tempzoom:10,
          // 最大等级
          maxZoom: 14,
          // 最小等级
          minZoom: 4
        },
        // 地图交互配置 可参考ol.interaction.defaults参数配置
        mapInteractionCfg: { 
          doubleClickZoom: false
        }
      },
      //底图字段
      Basemap:'vec_w'
    }
  }
})();