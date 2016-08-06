import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

export default class ChargeMapEngine{
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);
  }

  render(context, tick){
    if(!context.spriteSheetTexture.ready) return;

    context.chargeMapTexture.bindFramebuffer();

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms.tileSize = context.tileSize;

    this.shader.uniforms.spriteSheet = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms.netMap = context.netMapTexture.sampler2D(1);
    this.shader.uniforms.netCharges = context.netChargeTextures[tick%2].sampler2D(2);

    fillScreen(this.gl);

    context.chargeMapTexture.unbindFramebuffer();
  }
}