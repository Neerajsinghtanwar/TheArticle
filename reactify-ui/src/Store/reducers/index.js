import {combineReducers} from 'redux'
// import userData from './reducers'
import {userData, notificationData} from "./reducers";

export default combineReducers({
    userData, notificationData
})