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

import TileMap from './TileMap.js';
import TileMapRenderer from './TileMapRenderer.js';
import Perspective from './Perspective.js';
import Map from './Map.js';
import tiles from '../img/tiles.png';
import loadImage from './loadImage.js';

export default class Renderer {
  constructor(gl, canvas, storage) {
    gl.clearColor(0.0, 0.0, 0.1, 1.0);
    gl.clearDepth(1.0);

    this.map = Map.from(storage.load());
    this.storage = storage;
    this.tileMapRenderer = new TileMapRenderer(gl, this.map.width, this.map.height);
    this.perspective = new Perspective(this.map.width, this.map.height, 16);
    this.tileMap = new TileMap(gl, this.tileMapRenderer.tileTexture, this.perspective.mapToViewportMatrix);
    this.tileMap.setSpriteSheet(loadImage(tiles))
      .then(() => this.tileMapRenderer.update(this.map.data));
  }

  resize (gl, canvas) {
    this.perspective.setViewport(canvas.width, canvas.height);
  }

  scaleBy(scale){
    this.perspective.scaleBy(scale);
  }

  translateBy(x, y){
    this.perspective.translateBy(x, y);
  }

  tap(x, y){
    const [tx, ty] = this.perspective.viewportToMap(x, y);
    console.log(x, y, tx, ty);
    window.requestAnimationFrame(() => {
      this.map.toggle(tx, ty);
      this.tileMapRenderer.update(this.map.data);
      this.storage.save(this.map.export());
    });
  }

  draw (gl, timing) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.perspective.viewportSize[0], this.perspective.viewportSize[1]);

    this.tileMap.render();
  }
}
