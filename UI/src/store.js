import { createStore, combineReducers } from 'redux'

const initialState = {
  sidebarShow: 'responsive'
}


const commandQueue = (state = [], action) => {
  let newState

  switch (action.type) {
    case 'push':
      newState = [...state]
      newState.push(action.payload)
      return newState
    case 'shift':
      newState = [...state]
      newState.shift()
      return newState
    default:
      return state
  }
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  commandQueue,
  changeState,
})

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store