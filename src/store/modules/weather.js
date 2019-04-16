export default {
  namespaced: true,
  state: {
    type: 'cloud',
    timeDate: {
      startDate: +new Date(),
      endDate: +new Date(),
      gap: 0
    },
    extent: [0, 0, 0, 0],
    host: '',
    listMap: {}
  },
  getters: {
    timeDate: state => state.timeDate,
    type: state => state.type,
    extent: state => state.extent,
    host: state => state.host,
    listMap: state => state.listMap
  },
  mutations: {
    CHANGE_TIMEDATA (state, value) {
      state.timeDate = value
    },
    CHANGE_TYPE (state, value) {
      state.type = value
    },
    CHANGE_EXTENT (state, value) {
      state.extent = value
    },
    CHANGE_HOST (state, value) {
      state.host = value
    },
    CHANGE_LISTMAP (state, value) {
      state.listMap = value
    }
  }
}
