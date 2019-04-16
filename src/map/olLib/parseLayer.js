import ol from 'openlayers';

let parseLayer = {};

let imgBaseUrl = "/static/img/map/";
if (process.env.NODE_ENV && process.env.NODE_ENV === "development")
  imgBaseUrl = "/src/components/map/assets/images/";

parseLayer.getExtentFeatureFormWFS = function (layerNM, extent, resolution, proj, outPutFields) {
  // /arcgisWFS：通过代理 ，解决调用WFS服务时的跨域问题
  // outPutFields 需返回的属性字段 多个时以,分割；为空时 返回全部属性字段
  if (outPutFields == undefined) {
    outPutFields = '';
  }

  if (isNaN(extent[0]) || isNaN(extent[1]) || isNaN(extent[2]) || isNaN(extent[3])) {
    extent = [0, 0, 0, 0];
  }
  return '/arcgisWFS?request=GetFeature&service=WFS&version=1.1.0&typename=' + layerNM +
    '&propertyName=' + outPutFields + '&outputFormat=gml2&srsname=' + proj + '&' +
    'bbox=' + extent.join(',') + ',' + proj;
}

// 危险区样式
let daImg = document.createElement('img');
daImg.setAttribute('src', imgBaseUrl + 'cross.png');
parseLayer.setDangerousArea = function () {
  let cs = document.getElementsByTagName('canvas')[0];
  let ctx = cs.getContext('2d');
  let pat = ctx.createPattern(daImg, 'repeat');
  let daStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#C75DA2',
      width: 2
    }),
    fill: new ol.style.Fill({ color: pat })
  });
  return daStyle;
}

export default parseLayer
