import {createRoot} from 'react-dom/client';
import {css, cx} from '@emotion/css';
import {useCallback, useState} from 'react';
import '@fontsource/inter';
import './styles/index.scss';
import {Grid} from './components/Grid';

const App = () => {
  return <Grid gutter={`1rem`} />
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
