import Stats from 'stats-js';
import {render} from 'react-dom';
import React from 'react';

import '../css/main.css';
import '../manifest.json';
import offline from 'offline-plugin/runtime';

import Renderer from './Renderer.js';
import Storage from './Storage.js';
import WebGL from './WebGL.js';

import TouchControls from './interaction/TouchControls.js';
import App from './components/App.jsx';

offline.install();

const canvas = document.querySelector('canvas');
const reactApp = document.querySelector('.react-app');

const shell = new WebGL(canvas, {
  tickInterval: 1000
});

const storage = new Storage();
const renderer = new Renderer(shell.gl, storage);
const viewStats = new Stats();
const engineStats = new Stats();
const touchControls = new TouchControls(renderer);

viewStats.domElement.id = 'viewStats';
document.body.appendChild(viewStats.domElement);
engineStats.setMode(1);
engineStats.domElement.id = 'engineStats';
document.body.appendChild(engineStats.domElement);

touchControls.listen(shell.canvas);

shell.tick((tickCount) => {
  engineStats.begin();
  renderer.tick(tickCount);
  engineStats.end();
});

shell.render(() => {
  viewStats.begin();
  touchControls.panZoom();
  renderer.draw(shell.gl);
  viewStats.end();
});

shell.resize((w, h) => {
  renderer.resize(w, h);
  render(<App
    width={w/window.devicePixelRatio}
    height={h/window.devicePixelRatio}
    setTool={tool => renderer.setSelectedTool(tool)} />,
    reactApp);
});
