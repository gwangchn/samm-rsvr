import { Group as LayerGroup } from 'ol/layer'
import { easeOut } from 'ol/easing'
import { unByKey } from 'ol/Observable'
import { Style, Stroke, Circle, Fill } from 'ol/style'

export default class MapHelper {
  constructor(map) {
    if (!map)
      throw '必须传入map对象'
    this.map = map
  }

  // 根据名称搜索图层
  getLayer(name, group) {
    let layers = (group || this.map).getLayers();
    let len = layers.getLength();
    let layer = null;
    for (var i = 0; i < len; i++) {
      layer = layers.item(i);
      if (layer instanceof LayerGroup) {
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

  /*点闪烁
  feature：要素
  fRgb:填充颜色
  fillType：1填充面，0不填充面
  sWidth：闪烁边框渲染宽度
  */
  flash(feature, fRgb, fillType, sWidth) {
    let duration = 2000
    let start = new Date().getTime()
    let listenerKey
    let { map } = this
    
    let animate = event => {
      let vectorContext = event.vectorContext
      let frameState = event.frameState
      let flashGeom = feature.getGeometry().clone()
      let elapsed = frameState.time - start
      let elapsedRatio = elapsed / duration
      // radius will be 5 at start and 30 at end.
      let radius = easeOut(elapsedRatio) * 15 + 5
      let opacity = easeOut(1 - elapsedRatio)
      let style = new Style({
        image: new Circle({
          radius: radius,
          snapToPixel: false,
          stroke: new Stroke({
            color: 'rgba(' + fRgb + ', ' + opacity + ')',
            width: 0.25 + opacity
          })
        })
      })

      if (fillType == 1) {
        style = new Style({
          image: new Circle({
            radius: radius,
            snapToPixel: false,
            stroke: new Stroke({
              color: 'rgba(' + fRgb + ', ' + opacity + ')',
              width: 0.25 + opacity
            }),
            fill: new Fill({
              color: 'rgba(' + fRgb + ', ' + opacity + ')',
            })
          })
        })
      }

      vectorContext.setStyle(style)
      vectorContext.drawGeometry(flashGeom)

      if (elapsed > duration) {
        unByKey(listenerKey)
        return
      }

      // tell OpenLayers to continue postcompose animation
      map.render()
    }

    listenerKey = map.on('postcompose', animate)
  }
}