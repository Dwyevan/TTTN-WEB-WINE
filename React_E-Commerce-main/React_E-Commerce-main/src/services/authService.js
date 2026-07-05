import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8080") + "/api/users";

export const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
};