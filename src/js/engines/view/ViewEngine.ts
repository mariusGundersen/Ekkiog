import {vec2, mat3} from 'gl-matrix';
import createShader, {GlShader} from 'gl-shader';

import drawTriangle from 'a-big-triangle';

import viewVS from './viewVS.glsl';
import viewFS from './viewFS.glsl';

import Context from '../../Context';
import DataTexture from '../../textures/DataTexture';

export default class ViewEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, viewVS, viewFS);
  }

  render(context : Context, matrix : mat3) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();
    this.gl.clearColor(42/255, 45/255, 48/255, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clearColor(0, 0, 0, 1);

    this.shader.uniforms['inverseSpriteTextureSize'] = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms['mapTextureSize'] = context.tileMapTexture.size;
    this.shader.uniforms['tileSize'] = context.tileSize;
    this.shader.uniforms['matrix'] = matrix;

    this.shader.uniforms['spriteSheet'] = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms['chargeMap'] = context.chargeMapTexture.sampler2D(1);
    this.shader.uniforms['tileMap'] = context.tileMapTexture.sampler2D(2);

    drawTriangle(this.gl)
  }
}