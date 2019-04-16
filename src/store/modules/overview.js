import { getAll, getSurface } from '@/api/information/overview'

export default {
  namespaced: true,
  state: {
    warnList: [],
    focusRes: null
  },
  getters: {
    warnList: state => state.warnList,
    focusRes: state => state.focusRes
  },
  mutations: {
    CHANGE_WARNLIST: (state, value) => {
      state.warnList = value
    },
    CHANGE_FOCUSRES: (state, value) => {
      state.focusRes = value
    }
  },
  actions: {
    async getWarnData({ commit }) {
      let now = new Date()
      let userinfo = JSON.parse(sessionStorage.getItem('samm-userinfo'))
      let res = await getAll({
        dscdflage: userinfo.dscdflage,
        f: userinfo.f,
        startDate: new Date(now).formatDate('yyyy-MM-dd HH:00:00'),
        endDate: new Date(now).datePro('{%d+7}').formatDate('yyyy-MM-dd HH:00:00')
      })
      let data = res.data.result

      commit('CHANGE_WARNLIST', data)
      data.length > 0 && commit('CHANGE_FOCUSRES', data[0])
    },
    surface({}, date) {
      let userinfo = JSON.parse(sessionStorage.getItem('samm-userinfo'))
      return getSurface({
        dscdflage: userinfo.dscdflage,
        flagRealOrPred: 'S',
        la: 'A',
        startDate: new Date(date).datePro('{%d-1}').formatDate('yyyy-MM-dd 08:00:00'),
        endDate: new Date(date).formatDate('yyyy-MM-dd 08:00:00'),
        level: '1.5,6.9,14.9,39.9,49.9'
      })
    }
  }
}
