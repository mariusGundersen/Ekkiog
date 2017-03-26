import createShader, {GlShader} from 'gl-shader';

import drawTriangle from 'a-big-triangle';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

import ImageTexture from '../../textures/ImageTexture';
import RenderTexture from '../../textures/RenderTexture';
import DataTexture from '../../textures/DataTexture';

export default class ChargeMapEngine{
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);
  }

  render(input : DataTexture, charges : RenderTexture, spriteSheet : ImageTexture, output : RenderTexture){
    if(!spriteSheet.ready) return;

    output.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms['inverseSpriteTextureSize'] = spriteSheet.inverseSize;

    this.shader.uniforms['spriteSheet'] = spriteSheet.sampler2D(0);
    this.shader.uniforms['netMap'] = input.sampler2D(1);
    this.shader.uniforms['netCharges'] = charges.sampler2D(2);

    drawTriangle(this.gl)

    output.unbindFramebuffer();
  }
}