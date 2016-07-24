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

import ImageTexture from '../ImageTexture.js';
import Quadrangle from '../Quadrangle.js';
import loadImage from '../loadImage.js';
import tiles from '../../img/tiles.png';

import tilemapVS from './viewVS.glsl';
import tilemapFS from './viewFS.glsl';

export default class ViewEngine {
  constructor(gl, context, matrix) {
    this.gl = gl;
    this.context = context;
    this.matrix = matrix;

    this.quadrangle = new Quadrangle(gl);
    this.spriteSheetTexture = new ImageTexture(gl, loadImage(tiles));
    this.tileMapTexture = context.tileMapTexture;
    this.chargeMapTexture = context.chargeMapTexture;

    this.shader = createShader(gl, tilemapVS, tilemapFS);
  }

  render() {
    if(!this.spriteSheetTexture.ready) return;

    this.quadrangle.bindShader(this.shader);

    this.shader.uniforms.inverseSpriteTextureSize = this.spriteSheetTexture.inverseSize;
    this.shader.uniforms.mapTextureSize = this.tileMapTexture.size;
    this.shader.uniforms.tileSize = this.context.tileSize;
    this.shader.uniforms.matrix = this.matrix;

    this.shader.uniforms.spriteSheet = this.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms.chargeMap = this.chargeMapTexture.sampler2D(1);
    this.shader.uniforms.tileMap = this.tileMapTexture.sampler2D(2);

    this.quadrangle.render();
  }
}