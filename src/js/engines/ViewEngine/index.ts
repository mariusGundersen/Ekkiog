import {vec2, mat3} from 'gl-matrix';
import createShader, {GlShader} from 'gl-shader';

import viewVS from './viewVS.glsl';
import viewFS from './viewFS.glsl';

import { RenderContext } from '../textures/types';

export default class ViewEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, viewVS, viewFS);
  }

  render(context : RenderContext, matrix : mat3) {
    this.shader.bind();
    this.gl.clearColor(0.1, 0.1, 0.1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms['spriteTextureSize'] = context.spriteSheetTexture.size;
    this.shader.uniforms['inverseSpriteTextureSize'] = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms['mapTextureSize'] = context.tileMapTexture.size;
    this.shader.uniforms['tileSize'] = context.tileSize;
    this.shader.uniforms['matrix'] = matrix;

    this.shader.uniforms['spriteSheet'] = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms['chargeMap'] = context.chargeMapTexture.sampler2D(1);
    this.shader.uniforms['tileMap'] = context.tileMapTexture.sampler2D(2);

    context.triangle.draw();
  }
}