import types from '../actionsTypes';

const initialState = {
    myServices: [],
}

export default function myServices(state = initialState.myServices, { type, payload }) {
    switch (type) {
        case types.LOAD_MY_SERVICES:
            return [...payload];
        case type.REMOVE_MY_SERVICES:
            return initialState
        default:
            return state;
    }
}   
