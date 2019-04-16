import { transform } from 'ol/proj'
import { Vector as VectorSource,Cluster } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import { Style, Stroke, Circle, Fill } from 'ol/style'

export default class LayerCreator {
  // 描点
  static tracinpoint(data,title, styleCallBack) {
    let config = {
      style() {
        return new Style({
          image: new Circle({
            radius: 4,
            stroke: new Stroke({
              color: '#fff'
            }),
            fill: new Fill({
              color: 'red'
            })
          })
        })
      }
    };
    let vectorsource = new VectorSource({})
    data.map((fea) => {
      let coor = transform([fea.lgtd, fea.lttd], 'EPSG:4326', 'EPSG:3857')
      let geometrypt = new Point(coor)
      let feature = new Feature({
        geometry: geometrypt,
        attribute: fea
      })
      vectorsource.addFeature(feature)
    })

    return new VectorLayer({
      source: vectorsource,
      style:styleCallBack|| config.style,
      title: title
    })
  }

  // 地图上描聚合点
  static tracinCluster(data, title, styleCallBack){
    let vectorsource = new VectorSource({});
    let clusterSource = null;
    data.map((fea) => {
      let coor = transform([fea.lgtd, fea.lttd], 'EPSG:4326', 'EPSG:3857');
      let geometrypt = new Point(coor);
      let feature = new Feature({
        geometry: geometrypt,
        attribute: fea
      });
      vectorsource.addFeature(feature);
    });

    function getStyle(feature, resolution) {
      let arr = feature.getProperties().features;
      let sum = 0;
      arr.forEach(value => {
        let pp = value.getProperties().attribute.pp;
        sum += pp
      });
      sum = sum.toFixed(1)
      return new Style({
        text: new Text({
          font: '12px 微软雅黑,sans-serif',
          fill: new Fill({
            color: 'gold'
          }),
          text: sum,
          offsetX: 10,
          offsetY: -10,
          stroke: new Stroke({
            color: 'blue',
            width: 5
          })
        })
      });
    }

    clusterSource = new Cluster({
      distance: 60,
      source: vectorsource
    })

    return new VectorLayer({
      source: clusterSource,
      style: styleCallBack || getStyle,
      title: title
    });
  }
}