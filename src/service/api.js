import axios from 'axios';

const api = axios.create({
  baseURL: 'clinicapi-h4bfgdfac8bcfpbt.brazilsouth-01.azurewebsites.net/auth/login',
});

export default api;
