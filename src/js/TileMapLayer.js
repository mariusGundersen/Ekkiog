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
      const pixels = this.ctx.getImageData(x-1, y-1, 3, 3);
      for(let i=-1; i<2; i++){
        for(let j=-1; j<2; j++){
          const value = this.map.map[(y+i)*this.image.width + (x+j)] || 0;
          const index = ((i+1)*3+(j+1))*4;
          if(value != 1){
            pixels.data[index + 0] = 0;
            pixels.data[index + 1] = 0;
            pixels.data[index + 2] = 0;
            pixels.data[index + 3] = 255;
          }else{
            const tx = 0
              | (this.map.map[(y+i-1)*this.image.width + (x+j+0)]||0)<<0
              | (this.map.map[(y+i+0)*this.image.width + (x+j+1)]||0)<<1;
            const ty = 0
              | (this.map.map[(y+i+1)*this.image.width + (x+j+0)]||0)<<0
              | (this.map.map[(y+i+0)*this.image.width + (x+j-1)]||0)<<1;
            console.log(x+j, y+i, value, tx, ty);
            pixels.data[index + 0] = tx || ty ? tx : 3;
            pixels.data[index + 1] = tx || ty ? ty : 3;
            pixels.data[index + 2] = 0;
            pixels.data[index + 3] = 255;
          }
        }
      }
      this.ctx.putImageData(pixels, x-1, y-1);

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