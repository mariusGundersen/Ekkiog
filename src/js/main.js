/*
* Copyright (c) 2012 Brandon Jones
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
*    1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
*    2. Altered source versions must be plainly marked as such, and must not
*    be misrepresented as being the original software.
*
*    3. This notice may not be removed or altered from any source
*    distribution.
*/

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

  touchControls.listen(shell.canvas);
  renderer.resize(shell.canvas.width, shell.canvas.height);

  shell.on('tick', () => {
    console.log('tick', shell.tickCount);
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
