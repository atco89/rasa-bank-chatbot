'use strict';

import './scss/app.scss';
import setupWebChat from './js/chat/setup-web-chat';

const environment = process.env.ENVIRONMENT_CONFIG;
setupWebChat(environment);