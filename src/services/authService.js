import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/auth';

const login = async (username, password) => {
    // const token = 'Basic ' + btoa(username + ':' + password);

    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
            // authHeader: token,
        });

        if(response.data){
            // guardo el user en localStorage para mantener la sesion
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error("Error de login", error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    getCurrentUser,
};

export default authService;