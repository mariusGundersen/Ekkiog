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
      this.convolve(x-1, y-1, 3, 3);
      this.update();
    });

    this.tileTexture = gl.createTexture();
    this.halfMapSize = vec2.create();
    this.inverseHalfMapSize = vec2.create();
    this.gl = gl;

    this.convolve(0, 0, this.image.width, this.image.height);
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

  convolve(x, y, w, h){
    const pixels = this.ctx.getImageData(x, y, w, h);
    for(let i=0; i<pixels.height; i++){
      for(let j=0; j<pixels.width; j++){
        const index = (i*pixels.height+j)*4;
        this.prettify(pixels.data, index, x+j, y+i);
      }
    }
    this.ctx.putImageData(pixels, x, y);
  }

  prettify(pixels, index, x, y){
    const value = this.map.map[y*this.image.width + x] || 0;
    if(value != 1){
      pixels[index + 0] = 0;
      pixels[index + 1] = 0;
      pixels[index + 2] = 0;
      pixels[index + 3] = 255;
    }else{
      const tx = 0
        | (this.map.map[(y-1)*this.image.width + (x+0)]||0)<<0
        | (this.map.map[(y+0)*this.image.width + (x+1)]||0)<<1;
      const ty = 0
        | (this.map.map[(y+1)*this.image.width + (x+0)]||0)<<0
        | (this.map.map[(y+0)*this.image.width + (x-1)]||0)<<1;
      console.log(x, y, value, tx, ty);
      pixels[index + 0] = tx || ty ? tx : 3;
      pixels[index + 1] = tx || ty ? ty : 3;
      pixels[index + 2] = 0;
      pixels[index + 3] = 255;
    }
  }

  update(){
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tileTexture);

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
  }
}