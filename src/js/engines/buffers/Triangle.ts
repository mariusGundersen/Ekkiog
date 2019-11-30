import { VertexBuffer, AtomicBind, FrameBuffer } from './types';
import AbstractBindlable from './Bindable';

export default class Triangle extends AbstractBindlable implements VertexBuffer {
  private readonly gl: WebGLRenderingContext;
  private readonly buffer: WebGLBuffer;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind) {
    super(atomicBind);
    this.gl = gl;
    this.buffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW);
  }

  _bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
  }

  draw(output: FrameBuffer) {
    output.bind();
    this.bind();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
  }
}