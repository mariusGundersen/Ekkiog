import Stats from 'stats-js';
import createShell from 'gl-now';

import '../css/main.css';

import Renderer from './Renderer.js';
import TouchControls from './TouchControls.js';
import Storage from './Storage.js';

const shell = createShell({
  tickRate: 1000
});

shell.on('gl-init', () => {
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
  renderer.resize(shell.canvas.width, shell.canvas.height);

  shell.on('tick', () => {
    engineStats.begin();
    renderer.tick(shell.tickCount);
    engineStats.end();
  });

  shell.on('gl-render', (t) => {
    viewStats.begin();
    renderer.draw(shell.gl);
    viewStats.end();
  });

  shell.on('gl-resize', (w, h) => {
    renderer.resize(w, h);
  });

  shell.on('gl-error', e => {
    console.log(e);
  })
});
