import axios from 'axios';
import { MAIN_URL } from './config';

export const server = axios.create({
  baseURL: MAIN_URL,
  timeout: 15000,
});
