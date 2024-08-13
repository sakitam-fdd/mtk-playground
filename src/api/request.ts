import axios from 'axios';

const service = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://api.github.com',
  timeout: 60000,
});

service.interceptors.request.use(
  (config) => {
    console.log('[Axios] config', config);
    return config;
  },

  (error) => {
    console.log('[Axios] request error: ', error);
    return Promise.reject(error.message);
  },
);

service.interceptors.response.use(
  (response) => {
    console.log('[Axios] response: ', response.data);

    const res = response.data;

    if (res.code !== 0) {
      return Promise.reject(res.message);
    }

    return res;
  },

  (error) => {
    console.log('[Axios] response error: ', error);

    const response = error.response;

    if (
      response.status === 400 &&
      response.hasOwnProperty('data') &&
      response.data.code !== 0 &&
      response.data.message
    ) {
      return Promise.resolve(response.data);
    }

    return Promise.reject(error.message);
  },
);

export default service;
