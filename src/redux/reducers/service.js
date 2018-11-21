import types from '../actionsTypes';

const initialState = {
    service: {},
}

export default function service(state = initialState.service, { type, payload }) {
    switch (type) {
        case types.ADD_SERVICE:
            return {...payload}
        case types.REMOVE_SERVICE:
            return initialState;    
        default:
            return state;
    }
}   
