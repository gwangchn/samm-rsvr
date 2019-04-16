import ol from 'openlayers';
import mapConfig from "../mapConfig";
import $ from "jquery";

function mapHelper(map) {
  if (!map)
    throw '必须传入map对象';
  this.map = map;
}

mapHelper.prototype.getLayer = function (name, group) {
  let layers = (group || this.map).getLayers();
  let len = layers.getLength();
  let layer = null;
  for (var i = 0; i < len; i++) {
    layer = layers.item(i);
    if (layer instanceof ol.layer.Group) {
      var find = this.getLayer(name, layer);
      if (find) {
        return find;
      }
    } else if (layer.get('title') === name) {
      return layer;
    }
  }
  return null;
}

//定位到指定点位置
mapHelper.prototype.zoom = function (x, y, level) {
  let lgltAr = ol.proj.transform([parseFloat(x), parseFloat(y)], 'EPSG:4326', 'EPSG:3857');
  x = lgltAr[0];
  y = lgltAr[1];
  this.map.setView(new ol.View({
    projection: mapConfig.mapCfg.mapProjection,
    center: [parseFloat(x), parseFloat(y)],
    zoom: level,
    minZoom: mapConfig.mapCfg.minZoom,
    maxZoom: mapConfig.mapCfg.maxZoom
  }));
  let geom = new ol.geom.Point([x, y]);
  let feature = new ol.Feature(geom);
  feature.setStyle(new ol.style.Style());
  /* source.clear();
   source.addFeature(feature);*/
  this.flash(feature, '255, 0, 0', 0, 3);
  if (window.CollectGarbage != null && window.CollectGarbage != undefined) {
    window.CollectGarbage();
  }
}
//谷歌坐标缩放到点
mapHelper.prototype.googleZoom = function (x, y, level) {
  this.map.setView(new ol.View({
    projection: mapConfig.mapCfg.mapProjection,
    center: [parseFloat(x), parseFloat(y)],
    zoom: level,
    minZoom: mapConfig.mapCfg.minZoom,
    maxZoom: mapConfig.mapCfg.maxZoom
  }));
}

/*点闪烁
feature：要素
fRgb:填充颜色
fillType：1填充面，0不填充面
sWidth：闪烁边框渲染宽度
*/
mapHelper.prototype.flash = function (feature, fRgb, fillType, sWidth) {
  var duration = 2000;
  var start = new Date().getTime();
  var listenerKey;
  var map = this.map;

  function animate(event) {
    var vectorContext = event.vectorContext;
    var frameState = event.frameState;
    var flashGeom = feature.getGeometry().clone();
    var elapsed = frameState.time - start;
    var elapsedRatio = elapsed / duration;
    // radius will be 5 at start and 30 at end.
    var radius = ol.easing.easeOut(elapsedRatio) * 15 + 5;
    var opacity = ol.easing.easeOut(1 - elapsedRatio);

    var style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        snapToPixel: false,
        stroke: new ol.style.Stroke({
          color: 'rgba(' + fRgb + ', ' + opacity + ')',
          width: 0.25 + opacity
        })
      })
    });
    if (fillType == 1) {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          snapToPixel: false,
          stroke: new ol.style.Stroke({
            color: 'rgba(' + fRgb + ', ' + opacity + ')',
            width: 0.25 + opacity
          }),
          fill: new ol.style.Fill({
            color: 'rgba(' + fRgb + ', ' + opacity + ')',
          })
        })
      });
    }
    vectorContext.setStyle(style);
    vectorContext.drawGeometry(flashGeom);
    if (elapsed > duration) {
      ol.Observable.unByKey(listenerKey);
      return;
    }
    // tell OpenLayers to continue postcompose animation
    map.render();
  }
  listenerKey = this.map.on('postcompose', animate);
}

//添加html对象到地图
mapHelper.prototype.addElementToMap = function (el, x, y, id) {
  var marker = new ol.Overlay({
    id: id,
    position: [parseFloat(x), parseFloat(y)],
    positioning: 'center-center',
    element: el
  });
  this.map.addOverlay(marker);
  marker.setPosition([parseFloat(x), parseFloat(y)]);
}
//添加html对象到地图
mapHelper.prototype.addElementToMapL = function (el, x, y, id, cOffset, autoPan) {
  var marker = new ol.Overlay({
    id: id,
    element: el,
    offset: cOffset || [5, -25],
    autoPan: autoPan || false,
    autoPanAnimation: {
      duration: 250
    }
  });
  this.map.addOverlay(marker);
  marker.setPosition([parseFloat(x), parseFloat(y)]);
}

let isFirstPopup = true;
mapHelper.prototype.popup = function (coordinate, options) {

  var _base = this;
  //$("#popup").remove();
  if ($("#popup").length == 0) {
    var fel = document.createElement("div");
    fel.id = "popup";


    var ftb = '<span class="ol-popup-title">' + options.title + '</span><a href="javascript:void(0);" id="popup-closer" class="ol-popup-closer"></a><div id="popup-content"></div>';
    $(fel).html(ftb);
    $(fel).addClass("ol-popup");

    let popupOverlay = this.addElementToMapL(fel, 11.322, 23.1115, 'popupOverlay', [0, 0], true);
    this.map.getOverlayById('popupOverlay').setPosition(undefined);

    $('#popup-closer').click(function () {
      _base.map.getOverlayById('popupOverlay').setPosition(undefined);
      document.getElementById('popup-closer').blur();
      return false;
    });
  }

  // var geo = feature.getGeometry();
  // var gext = geo.getExtent();
  // var x = (parseFloat(gext[0]) + parseFloat(gext[2])) / 2;
  // var y = (parseFloat(gext[1]) + parseFloat(gext[3])) / 2;
  //
  // var x= 111.666667;//coordinate[0];
  // var y= 25.166667;//coordinate[1];
  let level = _base.map.getView().getZoom();
  let center = _base.map.getView().getCenter();

  let x = center[0];
  let y = center[1];
  if (options.width) {
    $("#popup").css("width", options.width);
  }
  if (options.height) {
    $("#popup").css("height", options.height);
  }
  $(".ol-popup-title").html(options.title);
  $("#popup-content").html(options.content);
  _base.map.getOverlayById('popupOverlay').setPosition(coordinate);

  //todo 不知道啥原因,第一次popup地图中心点严重偏移,在些又重设一次中心点
  if (isFirstPopup) {
    isFirstPopup = false;
    window.setTimeout(function () {
      _base.map.setView(new ol.View({
        projection: mapConfig.mapCfg.mapProjection,
        center: [parseFloat(x), parseFloat(y)],
        zoom: level,
        minZoom: mapConfig.mapCfg.minZoom,
        maxZoom: mapConfig.mapCfg.maxZoom
      }));
    }, 0)
  }
}

/*鼠标经过要素浮动提示*/
mapHelper.prototype.commonFeatureOverInfo = function (coordinate) {
  var pixel = this.map.getPixelFromCoordinate(coordinate);
  var featuresF = []; //浮动标注图层元素
  var featuresFl = []; //浮动图层标题
  this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
    featuresFl.push(layer.get('title'));
    featuresF.push(feature);
  });

  if (featuresF.length > 0) {
    if ($("#lFloatLable").length == 0) {
      var fel = document.createElement("div");
      var ftb = '<div id="lFloatLable" class="infoWindow_lable"> </div>';
      $(fel).html(ftb);
      $(fel).addClass("w-popup");
    }

    //获取指定图层配置信息
    function getLayerOptions(layerName) {
      var layers = mapConfig.layers;
      for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < layers[i].layers.length; j++) {
          if (layers[i].layers[j].title == layerName) {
            return layers[i].layers[j];
          }
        }
      }
      return -1;
    }

    if (this.map.getOverlayById('layerFloatLable') == null) {
      this.addElementToMapL(fel, 11.322, 23.1115, 'layerFloatLable', [10, 10]);
      this.map.getOverlayById('layerFloatLable').setPosition(undefined);
    }
    var layerOptions = getLayerOptions(featuresFl[0]);
    if (layerOptions != -1) {
      if (layerOptions.floatMarking != null && layerOptions.floatMarking != undefined && layerOptions.floatMarking != "") {
        var floatLable = "";
        for (var i = 0; i < layerOptions.floatMarking.length; i++) {
          floatLable += featuresF[0].get(layerOptions.floatMarking[i]) ? featuresF[0].get(layerOptions.floatMarking[i]) : "";
        }
        if (floatLable.trim() == "") {
          floatLable = "";
          return;
        }
        var floatClass = layerOptions.floatClass ? layerOptions.floatClass : "infoWindow_lable";
        $("#lFloatLable").attr("class", floatClass);
        $("#lFloatLable").html(floatLable);
        var geo = featuresF[0].getGeometry();
        var gext = geo.getExtent();
        var x = (parseFloat(gext[0]) + parseFloat(gext[2])) / 2;
        var y = (parseFloat(gext[1]) + parseFloat(gext[3])) / 2;
        var xyArr = this.map.getOverlayById('layerFloatLable').getPosition();
        if (xyArr != undefined) {
          if (xyArr[0] == x && xyArr[1] == y) {
            return;
          }
        }
        this.map.getOverlayById('layerFloatLable').setPosition([parseFloat(x), parseFloat(y)]);

      } else {
        if (this.map.getOverlayById('layerFloatLable') != null) {
          this.map.getOverlayById('layerFloatLable').setPosition(undefined);
        }
      }
    } else {
      if (this.map.getOverlayById('layerFloatLable') != null) {
        this.map.getOverlayById('layerFloatLable').setPosition(undefined);
      }
    }
  } else {
    if (this.map.getOverlayById('layerFloatLable') != null) {
      this.map.getOverlayById('layerFloatLable').setPosition(undefined);
    }
  }
}

/*切换底图
visibleBaseLayers:["vl1","vl2"]
collapsedBaseLayers::["cl1","cl2"]
*/
mapHelper.prototype.changeBaseMap = function (visibleBaseLayers, collapsedBaseLayers) {
  for (var key in visibleBaseLayers) {
    this.getLayer(visibleBaseLayers[key]).setVisible(true);
  }
  for (var key in collapsedBaseLayers) {
    this.getLayer(collapsedBaseLayers[key]).setVisible(false);
  }
}
//获取当前屏幕地图范围
mapHelper.prototype.getCurrentScreenExtent = function () {
  var arr1 = this.map.getCoordinateFromPixel([0, 0]);
  var arr2 = this.map.getCoordinateFromPixel(this.map.getSize());
  return [arr1[0], arr2[1], arr2[0], arr1[1], ];
}


export default mapHelper
