import axios from 'axios';

export const SERVER_URL: string =
  process.env.NODE_ENV === 'production'
    ? 'http://34.88.50.142'
    : 'http://localhost:65080';

export const server = axios.create({
  baseURL: SERVER_URL,
  timeout: 15000,
});
