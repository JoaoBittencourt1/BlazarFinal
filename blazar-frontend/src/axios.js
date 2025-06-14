// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // Aqui vai a URL do seu backend PHP
  timeout: 10000, // Tempo máximo de espera para a resposta
});

export default instance;