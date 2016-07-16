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
import Texture from './Texture.js';
import Quadrangle from './Quadrangle.js';

import tilemapVS from '../shaders/tilemapVS.glsl';
import tilemapFS from '../shaders/tilemapFS.glsl';

const TILE_SIZE = 64;

export default class TileMap {
  constructor(gl) {
    this.gl = gl;
    this.negativeHalfViewportSize = vec2.create();
    this.inverseHalfViewportSize = vec2.create();
    this.matrix = mat3.create();

    this.tileScale = vec2.create();
    this.inverseTileScale = vec2.create();
    this.tileSize = vec2.fromValues(TILE_SIZE, TILE_SIZE);
    this.inverseTileSize = vec2.fromValues(1/TILE_SIZE, 1/TILE_SIZE);

    this.spriteSheet = new Texture(gl, gl.TEXTURE0);
    this.quadrangle = new Quadrangle(gl);
    this.layers = [];

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
    return image.then(image => {
      this.spriteSheet.setImage(image);
    });
  }

  setTileLayer(texture, layerId) {
    this.layers[layerId] = texture;
  }

  viewportToMap(dx, dy, x, y, layer=0){
    mat3.identity(this.matrix);
    mat3.translate(this.matrix, this.matrix, this.layers[layer].halfSize);
    mat3.scale(this.matrix, this.matrix, this.inverseTileSize);
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

    this.quadrangle.bindShader(shader);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);

    gl.uniform2fv(shader.uniform.inverseSpriteTextureSize, this.spriteSheet.inverseSize);
    gl.uniform1f(shader.uniform.tileSize, TILE_SIZE);

    this.spriteSheet.activate();
    gl.uniform1i(shader.uniform.sprites, 0);
    this.spriteSheet.bind();

    // Draw each layer of the map
    for(let i = this.layers.length; i >= 0; --i) {
      const layer = this.layers[i];
      if(layer) {
        layer.activate();
        gl.uniform1i(shader.uniform.tiles, 1);
        layer.bind();

        mat3.fromScaling(this.matrix, this.inverseHalfViewportSize);
        mat3.translate(this.matrix, this.matrix, vec2.fromValues(-x, y));
        mat3.scale(this.matrix, this.matrix, this.tileScale);
        mat3.scale(this.matrix, this.matrix, this.tileSize);
        mat3.scale(this.matrix, this.matrix, layer.halfSize);

        gl.uniformMatrix3fv(shader.uniform.matrix, false, this.matrix);

        gl.uniform2fv(shader.uniform.mapTextureSize, layer.size);

        this.quadrangle.render();
      }
    }
  }
}