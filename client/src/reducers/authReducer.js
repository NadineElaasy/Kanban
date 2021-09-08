import isEmpty from '../validation/is-empty';
import {SET_CURRENT_USER, IS_SIGNEDUP} from '../actions/types'

const initialState ={
    isAuthenticated :false,
    user:{},
    isSignedUP:false
   
};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action ){
    switch(action.type){
        case SET_CURRENT_USER:
            return {
            ...state,
            isAuthenticated:!isEmpty(action.payload),
            user:action.payload
        }
        case IS_SIGNEDUP:
            return {
            ...state,
            isSignedUP:action.payload
        }
        default:
        return state;
    }
}