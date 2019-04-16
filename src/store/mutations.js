import * as types from './mutation-types'
const mutations = {
  [types.SET_RPANELWIDTH](state, value) {
    state.rPanelwidth = value
  },
  [types.SET_SHOWFLAG](state, value) {
    state.showFlag = value
  },
  [types.SET_HIDETIMEBAR](state, value) {
    state.Hidetimebar = value
  },
  [types.MENU_HIDE](state, value) {
    state.menuHide = value
  },
  [types.SET_COMMONTITLE](state, value) {
    state.commonTitle = value
  },
  [types.SET_TITLETIME](state, value) {
    state.titleTime = value
  },
  [types.SET_HIDETITLETIME](state, value) {
    state.hidetitleTime = value
  }
}

export default mutations
