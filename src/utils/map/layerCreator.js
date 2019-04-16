import { transform } from 'ol/proj'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import { Style, Stroke, Circle, Fill } from 'ol/style'

export default class LayerCreator {
  // 描点
  static tracinpoint(data, options) {
    let config = {
      lgtd: 'lgtd',
      lttd: 'lttd',
      title: '标题',
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
    }
    let vectorsource = new VectorSource({})
    if (options) {
      config = Object.assign(config, options)
    }
    data.map((fea) => {
      let coor = transform([fea[config.lgtd], fea[config.lttd]], 'EPSG:4326', 'EPSG:3857')
      let geometrypt = new Point(coor)
      let feature = new Feature({
        geometry: geometrypt,
        attribute: fea
      })
      vectorsource.addFeature(feature)
    })

    return new VectorLayer({
      source: vectorsource,
      style: config.style,
      title: config.title
    })
  }
}