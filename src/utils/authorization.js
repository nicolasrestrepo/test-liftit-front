import axios from 'axios';


const setAuthorization =  () => {
    axios.defaults.headers.common = {
        ...axios.defaults.headers.common,
        Authorization: `Bearer ${localStorage.getItem(
            'token'
        )}`,
    };
};

export {
    setAuthorization,
};