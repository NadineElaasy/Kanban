import {
  FETCH_BOARDS
} from '../actions/types';

const initialState ={   
    boardList:[]
};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action ){
    switch(action.type){
        case FETCH_BOARDS:
            return {
            ...state,
            boardList:action.payload
        }
        default:
        return state;
    }
}