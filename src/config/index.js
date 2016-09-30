let hostname = window.location.hostname;
let IS_DEV = (!!~hostname.indexOf('kenneth') || !!~hostname.indexOf('localhost')) ? true : false;

export const API_HOST = 'https://api.jotform.com';
export const APP_URL = (IS_DEV) ? 'http://localhost:3002/' : 'http://jotpoll.com/';
export const SERVER_URL = (IS_DEV) ? 'http://localhost/jotpoll/server/' : 'http://jotpoll.com/server/';
export const SUPPORTED_QUESTIONS = [
  'control_dropdown',
  'control_radio',
  'control_rating',
  'control_scale'
];

export const JOTFORM_COOKIE_AUTH = true;

export const FORMPICKER_LIMIT = 20;
export const FORMTITLE_TRUNCATE = 40;
export const QUESTIONTEXT_TRUNCATE = 30;

export const KEEN_PROJECTID = '57d8f9108db53dfda8a6fa5f';
export const KEEN_WRITEKEY = '07E4E802E552239398AF3333BEB1C15249F5AD330B63BE6100A019859A8DC71A7FDE0EC8795D8CA007C9ED14D3B5DDFA0C3CD07D1F6EA41580C19BF0D7294DEA85A8636571027B05896AF287E499E4FA60963323991C0F9982F5B2E62DF7AC03';
