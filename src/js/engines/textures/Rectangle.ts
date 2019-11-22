import { VertexBuffer, AtomicBind } from './types';

export default class Rectangle implements VertexBuffer {
  private readonly atomicBind: AtomicBind;
  private readonly gl: WebGLRenderingContext;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly indexBuffer: WebGLBuffer;
  constructor(atomicBind: AtomicBind, gl: WebGLRenderingContext) {
    this.atomicBind = atomicBind;
    this.gl = gl;
    this.vertexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.indexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.atomicBind(this);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -0.25, 0, 0,
      +1, -0.25, 1, 0,
      -1, +0.25, 0, 1,
      +1, +0.25, 1, 1
    ]), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW);
  }

  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 0, 0);
  }

  draw() {
    this.atomicBind(this);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  }
}