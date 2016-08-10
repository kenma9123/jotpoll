import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';

const basepath = {
    dev: '/',
    production: '/weebly/app'
};

const history = (environment) => {
    let basename = basepath[environment];
    return useRouterHistory(createHistory)({
        basename
    });
};

export default history;