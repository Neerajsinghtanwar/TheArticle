import { USER_LOGIN, NOTIFICATIONS } from '../constants'

const initialState = {
    cardData: []
}

const initialState2 = {
    notifyData: []
}

export function userData(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state,
                cardData: action.data
            }
        default:
            return state
    }
}

export function notificationData(state = initialState2, action) {
    switch (action.type) {
        case NOTIFICATIONS:
            return {
                ...state,
                notifyData: action.data
            }
        default:
            return state
    }
}
