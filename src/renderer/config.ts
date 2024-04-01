const mainIP = '35.228.239.86';
const localIP = 'localhost:65080';

const currentIP = process.env.NODE_ENV === 'production' ? mainIP : localIP;

const MAIN_URL = `http://${currentIP}`;
const WS_URL = `ws://${currentIP}`;

export { MAIN_URL, WS_URL };
