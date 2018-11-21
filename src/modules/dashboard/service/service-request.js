import { post } from '../../../utils/request';

const createService = async (data) => {
    try {
        const response = await post('/services', data);
        return response;
    } catch (error) {
        return error;
    }
    
};

export { 
    createService 
};