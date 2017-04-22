import { VertexBuffer, AtomicBind } from './types';

export default class Triangle implements VertexBuffer {
  private readonly atomicBind : AtomicBind;
  private readonly gl : WebGLRenderingContext;
  private readonly buffer : WebGLBuffer;
  constructor(atomicBind : AtomicBind, gl : WebGLRenderingContext){
    this.atomicBind = atomicBind;
    this.gl = gl;
    this.buffer = gl.createBuffer() || (() => {throw new Error("Could not make buffer")})();
    this.atomicBind(this);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW);
  }

  bind(){
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
  }

  draw(){
    this.atomicBind(this);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
  }
}