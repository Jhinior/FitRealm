import axios from 'axios';
//hn3ml import l el file da f kol component bdl m nktb  da http://localhost:8000 kol marah nzwod api endpoint

const API_BASE_URL = 'http://localhost:8000'; 


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;