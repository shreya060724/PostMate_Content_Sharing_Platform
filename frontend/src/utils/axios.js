import axios from 'axios';
import Cookies from 'js-cookie';

const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// ✅ Interceptor to attach token from cookies to every request
apiInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token'); // adjust the cookie key if different
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiInstance;
