import axios from 'axios';

export const SERVER_URL: string =
  process.env.NODE_ENV === 'production'
    ? 'http://35.228.239.86'
    : 'http://localhost:65080';

export const server = axios.create({
  baseURL: SERVER_URL,
  timeout: 15000,
});
