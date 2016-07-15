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

import {vec2, mat3} from 'gl-matrix';

import ShaderWrapper from './ShaderWrapper.js';
import TileMapLayer from './TileMapLayer.js';

import tilemapVS from '../shaders/vertex.glsl';
import tilemapFS from '../shaders/fragment.glsl';

export default class TileMap {
  constructor(gl) {
    this.gl = gl;
    this.negativeHalfViewportSize = vec2.create();
    this.inverseHalfViewportSize = vec2.create();
    this.inverseSpriteTextureSize = vec2.create();
    this.matrix = mat3.create();

    this.tileScale = vec2.create();
    this.inverseTileScale = vec2.create();
    this.tileSize = 64;

    this.spriteSheet = gl.createTexture();
    this.layers = [];

    const quadVerts = [
      //x  y  u  v
      -1, -1, 0, 1,
       1, -1, 1, 1,
       1,  1, 1, 0,

      -1, -1, 0, 1,
       1,  1, 1, 0,
      -1,  1, 0, 0
    ];

    this.quadVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);

    this.tilemapShader = ShaderWrapper.createFromSource(gl, tilemapVS, tilemapFS);
  }

  resizeViewport(width, height) {
    this.negativeHalfViewportSize[0] = -width / 2;
    this.negativeHalfViewportSize[1] = -height / 2;
    this.inverseHalfViewportSize[0] = 2 / width;
    this.inverseHalfViewportSize[1] = 2 / height;
  }

  setTileScale(scale) {
    vec2.set(this.tileScale, scale, scale);
    vec2.set(this.inverseTileScale, 1/scale, 1/scale);
  }

  setSpriteSheet(image) {
    image.then(image => {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.spriteSheet);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

      this.inverseSpriteTextureSize[0] = 1/image.width;
      this.inverseSpriteTextureSize[1] = 1/image.height;
    });
  }

  setTileLayer(src, layerId) {
    this.layers[layerId] = new TileMapLayer(this.gl, src, this.tileSize);
  }

  viewportToMap(dx, dy, x, y, layer=0){
    mat3.identity(this.matrix);
    mat3.scale(this.matrix, this.matrix, this.layers[layer].inverseHalfMapSize);
    mat3.translate(this.matrix, this.matrix, this.layers[layer].halfMapSize);
    mat3.scale(this.matrix, this.matrix, this.inverseTileScale);
    mat3.translate(this.matrix, this.matrix, vec2.fromValues(dx, dy));
    mat3.translate(this.matrix, this.matrix, vec2.fromValues(x, y));
    mat3.translate(this.matrix, this.matrix, this.negativeHalfViewportSize);

    return [Math.floor(this.matrix[6]), Math.floor(this.matrix[7])];
  }

  draw(x, y) {
    const gl = this.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const shader = this.tilemapShader;
    gl.useProgram(shader.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);

    gl.enableVertexAttribArray(shader.attribute.position);
    gl.enableVertexAttribArray(shader.attribute.texture);
    gl.vertexAttribPointer(shader.attribute.position, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(shader.attribute.texture, 2, gl.FLOAT, false, 16, 8);

    gl.uniform2fv(shader.uniform.inverseSpriteTextureSize, this.inverseSpriteTextureSize);
    gl.uniform1f(shader.uniform.tileSize, this.tileSize);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(shader.uniform.sprites, 0);
    gl.bindTexture(gl.TEXTURE_2D, this.spriteSheet);

    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(shader.uniform.tiles, 1);

    // Draw each layer of the map
    for(let i = this.layers.length; i >= 0; --i) {
      const layer = this.layers[i];
      if(layer) {
        mat3.fromScaling(this.matrix, this.inverseHalfViewportSize);
        mat3.translate(this.matrix, this.matrix, vec2.fromValues(-x, y));
        mat3.scale(this.matrix, this.matrix, this.tileScale);
        mat3.scale(this.matrix, this.matrix, layer.halfMapSize);

        gl.uniformMatrix3fv(shader.uniform.matrix, false, this.matrix);

        gl.uniform2fv(shader.uniform.halfMapSize, layer.halfMapSize);

        layer.render();

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
  }
}