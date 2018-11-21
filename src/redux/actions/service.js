import types from '../actionsTypes';

export function addService(service){
    return{
        type: types.ADD_SERVICE,
        payload: service
    }
}

export function removeService(){
    return{
        type: types.REMOVE_SERVICE
    }
}
