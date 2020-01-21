import axios from 'axios';

const api = axios.create({
    //use your pc host IP
    baseURL: 'http://192.168.1.56:3333',
});

export default api;