import {USER_LOGIN, NOTIFICATIONS} from '../constants'
import {default as ax} from "axios";

export const userLogin =(data)=>{
    return {
        type:USER_LOGIN,
        data:data
    }
}

export const notifications =(data)=>{
    return {
        type:NOTIFICATIONS,
        data:data
    }
}

export const axios = ax.create({
    baseURL:`http://127.0.0.1:8000/`
})

export const url = `http://127.0.0.1:8000/`;