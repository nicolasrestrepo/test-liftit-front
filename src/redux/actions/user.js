import types from '../actionsTypes';

export function addUser(user){
    return{
        type: types.ADD_USER,
        payload: user
    }
}

export function removeUser(){
    return{
        type: types.REMOVE_USER
    }
}