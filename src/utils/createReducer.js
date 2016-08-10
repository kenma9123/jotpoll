/**
 * https://github.com/rackt/redux/issues/883
 * an elegance way to write reducer
 * @param handlers the functions map
 * @param initState initiate state
 * @returns {Function}
 */
export default function createReducer(handlers, initialState) {
  return (state = initialState, action) =>
    handlers[action.type] ?
      handlers[action.type](state, action) :
      state;
}
