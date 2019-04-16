import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'
import water from './modules/water'
import rain from './modules/rain'
import overview from './modules/overview'
import warning from './modules/warning'
import dispatch from './modules/dispatch'
import risk from './modules/risk'
import weather from './modules/weather'
import resDetail from './modules/resDetail'
import Jobforecast from './modules/floodforecast/Jobforecast'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules:{
    water,
    rain,
    overview,
    warning,
    dispatch,
    risk,
    weather,
    resDetail,
    Jobforecast
  }
})
