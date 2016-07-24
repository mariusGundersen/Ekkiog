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

import ViewEngine from './view/ViewEngine.js';
import TileMapEngine from './tileMap/TileMapEngine.js';
import ChargeMapEngine from './chargeMap/ChargeMapEngine.js';
import NetChargeEngine from './netCharges/NetChargeEngine.js';
import Perspective from './Perspective.js';
import Context from './Context.js';

const TILE_SIZE = 16;

export default class Renderer {
  constructor(gl, storage) {
    this.storage = storage;
    const loaded = storage.load();
    this.context = new Context(gl, loaded.width, loaded.height, TILE_SIZE);
    this.context.import(loaded.data);

    this.context.mapTexture.set(65, 66, 2);

    this.context.mapTexture.set(70, 65, 2);

    this.context.mapTexture.set(70, 69, 2);

    this.netChargeEngine = new NetChargeEngine(gl, this.context);
    this.netChargeEngine.render(0);

    this.chargeMapEngine = new ChargeMapEngine(gl, this.context);
    this.chargeMapEngine.render(0);

    this.tileMapEngine = new TileMapEngine(gl, this.context);
    this.context.mapTexture.update();
    this.tileMapEngine.render();

    this.perspective = new Perspective(this.context);
    this.viewEngine = new ViewEngine(gl, this.context, this.perspective.mapToViewportMatrix);
  }

  resize (width, height) {
    this.perspective.setViewport(width, height);
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
      this.context.mapTexture.toggle(tx, ty);
      this.context.mapTexture.update();
      this.tileMapEngine.render();
      this.storage.save(this.context.export());
    });
  }

  tick(tick){
    this.netChargeEngine.render(tick);
    this.chargeMapEngine.render(tick);
  }

  draw(gl) {
    gl.viewport(0, 0, this.perspective.viewportSize[0], this.perspective.viewportSize[1]);

    this.viewEngine.render();
  }
}
