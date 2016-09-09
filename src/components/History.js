import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';

const basepath = {
    dev: '/',
    production: '/jotpoll'
};

const history = (environment) => {
    let basename = basepath[environment];
    return useRouterHistory(createHistory)({
        basename
    });
};

export default history;