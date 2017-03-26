import createShader, {GlShader} from 'gl-shader';

import drawTriangle from 'a-big-triangle';

import netChargesVS from './netChargesVS.glsl';
import netChargesFS from './netChargesFS.glsl';

import RenderTexture from '../../textures/RenderTexture';
import DataTexture from '../../textures/DataTexture';

export default class NetChargeEngine {
  gl : WebGLRenderingContext;
  shader : GlShader
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, netChargesVS, netChargesFS);
  }

  render(inputTexture : RenderTexture, gatesTexture : DataTexture, outputTexture : RenderTexture){
    outputTexture.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms['gates'] = gatesTexture.sampler2D(0);
    this.shader.uniforms['netCharges'] = inputTexture.sampler2D(1);

    drawTriangle(this.gl)

    outputTexture.unbindFramebuffer();
  }
}