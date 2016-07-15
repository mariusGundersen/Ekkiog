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

export default class TileMapLayer{
  constructor(gl, map, tileSize) {
    this.map = map;
    this.image = document.createElement('canvas');
    this.image.width = map.width;
    this.image.height = map.height;
    this.ctx = this.image.getContext('2d');
    this.map.onChange((x, y) => {
      const pixels = this.ctx.getImageData(x, y, 1, 1);
      const value = this.map.map[y*this.image.width + x];
      pixels.data[0] = value/4;
      pixels.data[1] = value%4;
      pixels.data[2] = 0;
      pixels.data[3] = 255;

      this.ctx.putImageData(pixels, x, y);

      this.update();
    });

    this.tileTexture = gl.createTexture();
    this.halfMapSize = vec2.create();
    this.inverseHalfMapSize = vec2.create();
    this.gl = gl;

    this.update();

    // MUST be filtered with NEAREST or tile lookup fails
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.halfMapSize[0] = this.image.width * tileSize / 2;
    this.halfMapSize[1] = this.image.height * tileSize / 2;

    this.inverseHalfMapSize[0] = 1 / tileSize;
    this.inverseHalfMapSize[1] = 1 / tileSize;
  }

  update(){
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tileTexture);

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
  }
}