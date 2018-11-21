
import types from '../actionsTypes';
import { get } from '../../utils/request' ;

export function setAllServices(services){
    return {
        type: types.LOAD_MY_SERVICES,
        payload: services
    }
}


export function loadServices() {
    return async (dispatch, getState) => {
        const { user } = getState()
        const { data: { services } } = await get('/services', `user._id=${user.id}`);
        dispatch(setAllServices(services));
        return user;
    }
}