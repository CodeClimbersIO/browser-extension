import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Popup } from '../components/Popup/Popup';
import { createStore } from '../stores/createStore';

import { ThemeProvider } from '../stores/ThemeProvider';

const container = document.getElementById('root');
const root = createRoot(container!);
const store = createStore();

const Component = () => (
  <ThemeProvider>
    <Popup />
  </ThemeProvider>
);

root.render(
  <Provider store={store}>
    <Component />
  </Provider>,
);
