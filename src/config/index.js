const APP_CONFIG = require('./app.json');

let hostname = window.location.hostname;
let IS_DEV = (!!~hostname.indexOf('kenneth') || !!~hostname.indexOf('localhost')) ? true : false;

export const APP_URL = 'http://' + hostname + '/weebly/app';
export const API_URL = 'http://' + hostname + '/weebly/server.php';

export const IS_ADMIN = ((window.User && !!~APP_CONFIG.admins.indexOf(window.User.username)) || IS_DEV) ? true : false;