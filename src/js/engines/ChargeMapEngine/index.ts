import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

export default class ChargeMapEngine {
  gl: WebGLRenderingContext;
  shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);
  }

  render(vertexBuffer: VertexBuffer, input: TextureBuffer, charges: TextureBuffer, spriteSheet: TextureBuffer, output: FrameBuffer) {
    this.shader.bind();

    this.shader.uniforms['inverseSpriteTextureSize'] = spriteSheet.inverseSize;

    this.shader.uniforms['spriteSheet'] = spriteSheet.sampler2D(0);
    this.shader.uniforms['netMap'] = input.sampler2D(1);
    this.shader.uniforms['netCharges'] = charges.sampler2D(2);

    vertexBuffer.draw(output);
  }
}