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

import {vec2} from 'gl-matrix';
import ndarray from 'ndarray';

import Texture from './Texture.js';

export default class TileMapLayer{
  constructor(gl, map, tileSize) {
    this.map = ndarray(map.map, [map.height, map.width]);
    this.data = new Uint8Array(map.height*map.width*4);
    this.image = ndarray(this.data, [map.height, map.width, 4]);
    this.width = map.width;
    this.height = map.height;
    map.onChange((x, y) => {
      this.convolve(x-1, y-1, 3, 3);
      this.update();
    });

    this.texture = new Texture(gl, gl.TEXTURE1, {width: map.width, height: map.height});
    this.halfMapSize = vec2.create();
    this.gl = gl;

    this.convolve(1, 1, this.width-2, this.height-2);
    this.update();

    this.halfMapSize[0] = this.width * tileSize / 2;
    this.halfMapSize[1] = this.height * tileSize / 2;
  }

  convolve(x, y, w, h){
    const map = this.map.lo(y-1, x-1).hi(h, w);
    const pixels = this.image.lo(y-1, x-1).hi(h, w);

    for(let i=1; i<h+1; i++){
      for(let j=1; j<w+1; j++){
        this.prettify(pixels, map, j, i);
      }
    }
  }

  prettify(pixels, map, j, i){
    const value = map.get(i, j);
    const tx = 0
      | (map.get(i-1, j+0) << 0)
      | (map.get(i+0, j+1) << 1);
    const ty = 0
      | (map.get(i+1, j+0) << 0)
      | (map.get(i+0, j-1) << 1);
    pixels.set(i, j, 0, tx + value*4);
    pixels.set(i, j, 1, ty);
    pixels.set(i, j, 2, 0);
  }

  update(){
    this.texture.setData(this.data);
  }
}