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
import createShader from 'gl-shader';

import Texture from '../Texture.js';
import Quadrangle from '../Quadrangle.js';

import tileVS from './tileMapVS.glsl';
import tileFS from './tileMapFS.glsl';

export default class TileMapEngine{
  constructor(gl, context) {
    this.gl = gl;
    this.quadrangle = new Quadrangle(gl);
    this.shader = createShader(gl, tileVS, tileFS);

    this.width = context.width;
    this.height = context.height;

    this.mapTexture = context.mapTexture;

    this.frameBuffer = gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.tileTexture = context.tileMapTexture;

    const renderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.tileTexture.texture, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderBuffer);
  }

  render(){
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.quadrangle.bindShader(this.shader);

    this.shader.uniforms.tilemap = this.mapTexture.sampler2D(0);

    this.shader.uniforms.inverseTileTextureSize = this.mapTexture.inverseSize;

    this.quadrangle.render();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
}