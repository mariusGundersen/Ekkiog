import { VertexBuffer, AtomicBind, FrameBuffer } from './types';
import AbstractBindlable from './Bindable';

export default class Rectangle extends AbstractBindlable implements VertexBuffer {
  private readonly gl: WebGLRenderingContext;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly indexBuffer: WebGLBuffer;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind) {
    super(atomicBind);
    this.gl = gl;
    this.vertexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.indexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ]), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW);
  }

  _bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
  }

  draw(output: FrameBuffer) {
    output.bind();
    this.bind();
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  }
}