import decode from 'jwt-decode';

const isAuthenticated = async () => { 
    const token = localStorage.getItem('token');
    try {
      decode(token);
    } catch (err) {
      return false;
    }
    return true;
};

export default isAuthenticated;