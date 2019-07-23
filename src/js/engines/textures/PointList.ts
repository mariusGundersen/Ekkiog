import ndarray, { NdArray } from 'ndarray';

import { VertexBuffer, AtomicBind } from './types';
import { Quad } from '../text/types';

export default class PointList implements VertexBuffer {
  private readonly atomicBind: AtomicBind;
  private readonly gl: WebGLRenderingContext;
  private size: number;
  private vertices: Float32Array;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly indexBuffer: WebGLBuffer;
  private readonly map: NdArray;
  constructor(atomicBind: AtomicBind, gl: WebGLRenderingContext) {
    this.atomicBind = atomicBind;
    this.gl = gl;
    this.size = 8;
    this.vertices = new Float32Array(this.size * 4);
    this.vertexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.indexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.map = ndarray(this.vertices, [this.size, 4]);
    this.set([0, 1, 2, 3, 4, 5, 6, 7]);
  }

  set(gates: number[]) {
    this.size = gates.length;
    this.vertices = new Float32Array(this.size * 4);
    this.map.data = this.vertices;
    for (let i = 0; i < this.size; i++) {
      const v = gates[i];
      this.map.set(i, 0, 0);
      this.map.set(i, 1, (i + 0.5) / this.size);
      this.map.set(i, 2, ((v >> 0) & 0xff));
      this.map.set(i, 3, ((v >> 8) & 0xff));
    }
    this.atomicBind(this);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createPoints(this.size)), this.gl.STATIC_DRAW);
  }

  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 0, 0);
  }

  draw() {
    this.atomicBind(this);
    this.gl.drawElements(this.gl.POINTS, this.size, this.gl.UNSIGNED_SHORT, 0);
  }
}

export function* createPoints(size: number) {
  for (let i = 0; i < size; i++) {
    yield i;
  }
}