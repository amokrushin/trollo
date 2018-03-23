import axios from 'axios';
import qs from 'qs';

const APP_ORIGIN = process.env.APP_ORIGIN || window.location.origin;

const request = axios.create({
    baseURL: APP_ORIGIN,
    withCredentials: true,
    timeout: 5000,
    paramsSerializer: (params) => {
        return qs.stringify(params);
    },
});

export default request;
