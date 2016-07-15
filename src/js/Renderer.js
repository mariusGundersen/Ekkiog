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
import Map from './Map.js';
import tiles from '../img/tiles.png';
import loadImage from './loadImage.js';

export default class Renderer {
  constructor(gl, canvas) {
    gl.clearColor(0.0, 0.0, 0.1, 1.0);
    gl.clearDepth(1.0);

    this.map = new Map();

    this.tileMap = new TileMap(gl);
    this.tileMap.setSpriteSheet(loadImage(tiles));
    this.tileMap.setTileLayer(this.map, 0);
    this.pos = {
      x: 0,
      y: 0,
      scale: 1
    }
  }

  moveTo(x, y){
    this.pos.x = x;
    this.pos.y = y;
  }

  moveBy(dx=0, dy=0){
    this.pos.x+=dx;
    this.pos.y+=dy;
  }

  scale(scale){
    this.pos.scale = scale;
    this.tileMap.setTileScale(this.pos.scale);
  }

  scaleBy(scale){
    this.pos.scale*=scale;
    this.tileMap.setTileScale(this.pos.scale);
  }

  resize (gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.tileMap.resizeViewport(canvas.width, canvas.height);
  }

  tap(x, y){
    const [tx, ty] = this.tileMap.viewportToMap(this.pos.x, this.pos.y, x, y);
    window.requestAnimationFrame(() => this.map.toggle(tx, ty));
  }

  draw (gl, timing) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.tileMap.draw(
      this.pos.x,
      this.pos.y);
  }
}
