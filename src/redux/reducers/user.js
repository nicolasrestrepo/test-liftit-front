import types from '../actionsTypes';

const initialState = {
    user: {}
}

export default function user(state = initialState.user, { type, payload }) {
    switch (type) {
        case types.ADD_USER:
            return {...payload}
        case types.REMOVE_USER:
            return initialState;    
        default:
            return state;
    }
}   
