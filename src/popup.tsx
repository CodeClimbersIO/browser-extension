import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import CodeClimbers from './components/CodeClimbers';
import createStore from './stores/createStore';
import checkCurrentUser from './utils/checkCurrentUser';

import 'bootstrap/dist/js/bootstrap';

const container = document.getElementById('codeclimbers');
const root = createRoot(container!);
const store = createStore('CodeClimbers-Options');
checkCurrentUser(store)(30 * 1000);

root.render(
  <Provider store={store}>
    <CodeClimbers />
  </Provider>,
);
