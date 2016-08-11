let hostname = window.location.hostname;
let IS_DEV = (!!~hostname.indexOf('kenneth') || !!~hostname.indexOf('localhost')) ? true : false;

export const API_HOST = 'https://api.jotform.com';
export const SERVER_URL = 'http://localhost/jotpoll/server/';
export const SUPPORTED_QUESTIONS = ['control_dropdown', 'control_radio', 'control_rating', 'control_scale'];