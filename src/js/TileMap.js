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
import createShader from 'gl-shader';

import Texture from './Texture.js';
import Quadrangle from './Quadrangle.js';

import tilemapVS from '../shaders/tilemapVS.glsl';
import tilemapFS from '../shaders/tilemapFS.glsl';

const TILE_SIZE = 16;

export default class TileMap {
  constructor(gl, tileMapTexture, matrix) {
    this.gl = gl;
    this.matrix = matrix;

    this.quadrangle = new Quadrangle(gl);
    this.spriteSheetTexture = new Texture(gl, gl.TEXTURE2);
    this.tileMapTexture = tileMapTexture;
    this.chargeMapTexture = new Texture(gl, gl.TEXTURE3, {width: tileMapTexture.width, height: tileMapTexture.height});
    this.chargeMapTexture.setData(new Uint8Array(tileMapTexture.width*tileMapTexture.height*4));

    this.shader = createShader(gl, tilemapVS, tilemapFS);
  }

  setSpriteSheet(image) {
    return image.then(image => {
      this.spriteSheetTexture.setImage(image);
    });
  }

  render() {
    const gl = this.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const shader = this.shader;

    this.quadrangle.bindShader(shader);

    shader.uniforms.inverseSpriteTextureSize = this.spriteSheetTexture.inverseSize;
    shader.uniforms.tileSize = TILE_SIZE;

    this.spriteSheetTexture.activate();
    shader.uniforms.spriteSheet = this.spriteSheetTexture.sampler2D;
    this.spriteSheetTexture.bind();

    this.tileMapTexture.activate();
    shader.uniforms.tileMap = this.tileMapTexture.sampler2D;
    this.tileMapTexture.bind();

    this.chargeMapTexture.activate();
    shader.uniforms.chargeMap = this.chargeMapTexture.sampler2D;
    this.chargeMapTexture.bind();

    shader.uniforms.matrix = this.matrix;

    shader.uniforms.mapTextureSize = this.tileMapTexture.size;

    this.quadrangle.render();
  }
}