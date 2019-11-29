import ndarray, { NdArray } from 'ndarray';

import { VertexBuffer, AtomicBind, FrameBuffer } from './types';
import AbstractBindlable from './Bindable';

export default class PointList extends AbstractBindlable implements VertexBuffer {
  private readonly gl: WebGLRenderingContext;
  private size: number;
  private vertices: Float32Array;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly indexBuffer: WebGLBuffer;
  private readonly map: NdArray;
  private count: number;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind) {
    super(atomicBind);
    this.gl = gl;
    this.size = 2;
    this.vertices = new Float32Array(this.size * 4);
    this.vertexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.indexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.bind();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createPoints(this.size)), this.gl.STATIC_DRAW);
    this.map = ndarray(this.vertices, [this.size, 4]);
    this.count = 0;
  }

  set(offset: number, points: { x: number, y: number }[]) {
    this.maybeUpsize(points.length);
    this.maybeDownsize(points.length);

    this.count = 0;
    for (const { x, y } of points) {
      this.map.set(this.count, 0, 0);
      this.map.set(this.count, 1, offset + this.count + 0.5);
      this.map.set(this.count, 2, x);
      this.map.set(this.count, 3, y);
      this.count++;
    }

    this.update();
  }

  _bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 0, 0);
  }

  update() {
    this.bind()
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
  }

  draw(output: FrameBuffer) {
    output.bind();
    this.bind();
    this.gl.drawElements(this.gl.POINTS, this.count, this.gl.UNSIGNED_SHORT, 0);
  }

  maybeUpsize(count: number) {
    if (count <= this.size) return;

    this.size *= 2;
    const old = this.vertices;
    this.vertices = new Float32Array(this.size * 16);
    this.vertices.set(old, 0);
    this.map.data = this.vertices;
    this.update();
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createPoints(this.size)), this.gl.STATIC_DRAW);
  }

  maybeDownsize(count: number) {
    if (count >= this.size / 4) return;

    const size = Math.max(8, 2 ** Math.ceil(1 + Math.log(count) / Math.log(2)));
    if (size >= this.size) return;

    this.size = size;
    this.vertices = new Float32Array(this.vertices.buffer, 0, this.size * 16);
    this.map.data = this.vertices;
    this.update();
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createPoints(this.size)), this.gl.STATIC_DRAW);
  }
}

export function* createPoints(size: number) {
  for (let i = 0; i < size; i++) {
    yield i;
  }
}