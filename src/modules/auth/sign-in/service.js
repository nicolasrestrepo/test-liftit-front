import { post } from '../../../utils/request';

const login = async (email, password) => {
    try {
        const response = await post('/login', {
            email,
            password
        });
        return response;
    } catch (error) {
        return error;
    }
    
};

export { 
    login 
};