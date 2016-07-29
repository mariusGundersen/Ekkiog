import Stats from 'stats-js';

import '../css/main.css';

import Renderer from './Renderer.js';
import TouchControls from './interaction/TouchControls.js';
import Storage from './Storage.js';
import WebGL from './WebGL.js';

const canvas = document.querySelector('canvas');

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

const buttons = Array.from(document.querySelectorAll('.toolbar>button'));
for(const button of buttons){
  button.addEventListener('click', e => {
    buttons.forEach(b => b.className = '');
    button.className = 'selected';
    renderer.setSelectedTool(button.dataset.type);
  });
}

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
});
