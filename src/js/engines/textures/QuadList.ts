import ndarray, { NdArray } from 'ndarray';

import { VertexBuffer, AtomicBind } from './types';
import { Quad } from '../text/types';

export default class QuadList implements VertexBuffer {
  private readonly atomicBind : AtomicBind;
  private readonly gl : WebGLRenderingContext;
  private size : number;
  private vertices : Float32Array;
  private readonly vertexBuffer : WebGLBuffer;
  private readonly indexBuffer : WebGLBuffer;
  private readonly map : NdArray;
  private count : number;
  constructor(atomicBind : AtomicBind, gl : WebGLRenderingContext){
    this.atomicBind = atomicBind;
    this.gl = gl;
    this.size = 8;
    this.vertices = new Float32Array(16*this.size);
    this.vertexBuffer = gl.createBuffer() || (() => {throw new Error("Could not make buffer")})();
    this.indexBuffer = gl.createBuffer() || (() => {throw new Error("Could not make buffer")})();
    this.atomicBind(this);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createQuads(this.size)), gl.STATIC_DRAW);
    this.map = ndarray(this.vertices, [this.size, 4, 2, 2]);
    this.count = 0;
  }

  set(index : number, quad : Quad){
    this.maybeUpsize(this.count + 1);

    this.map.set(index, 0, 0, 0, quad.pos.x);
    this.map.set(index, 0, 0, 1, quad.pos.y);
    this.map.set(index, 0, 1, 0, quad.uv.x);
    this.map.set(index, 0, 1, 1, quad.uv.y);

    this.map.set(index, 1, 0, 0, quad.pos.x+quad.pos.w);
    this.map.set(index, 1, 0, 1, quad.pos.y);
    this.map.set(index, 1, 1, 0, quad.uv.x+quad.uv.w);
    this.map.set(index, 1, 1, 1, quad.uv.y);

    this.map.set(index, 2, 0, 0, quad.pos.x);
    this.map.set(index, 2, 0, 1, quad.pos.y+quad.pos.h);
    this.map.set(index, 2, 1, 0, quad.uv.x);
    this.map.set(index, 2, 1, 1, quad.uv.y+quad.uv.h);

    this.map.set(index, 3, 0, 0, quad.pos.x+quad.pos.w);
    this.map.set(index, 3, 0, 1, quad.pos.y+quad.pos.h);
    this.map.set(index, 3, 1, 0, quad.uv.x+quad.uv.w);
    this.map.set(index, 3, 1, 1, quad.uv.y+quad.uv.h);
    this.count++;
  }

  remove(start : number, count : number){
    this.vertices.copyWithin(start*16, (start+count)*16, this.count*16);
    this.count -= count;

    this.maybeDownsize(this.count);
  }

  bind(){
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 0, 0);
  }

  update(){
    this.atomicBind(this);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
  }

  draw(){
    this.atomicBind(this);
    this.gl.drawElements(this.gl.TRIANGLES, this.count*6, this.gl.UNSIGNED_SHORT, 0);
  }

  maybeUpsize(count : number){
    if(count <= this.size) return;

    this.size*=2;
    const old = this.vertices;
    this.vertices = new Float32Array(this.size*16);
    this.vertices.set(old, 0);
    this.map.data = this.vertices;
    this.update();
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createQuads(this.size)), this.gl.STATIC_DRAW);
  }

  maybeDownsize(count : number){
    if(count >= this.size/4) return;

    const size = Math.max(8, 2**Math.ceil(1+Math.log(count)/Math.log(2)));
    if(size >= this.size) return;

    this.size = size;
    this.vertices = new Float32Array(this.vertices.buffer, 0, this.size*16);
    this.map.data = this.vertices;
    this.update();
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createQuads(this.size)), this.gl.STATIC_DRAW);
  }
}

export function* createQuads(size : number){
  for(let i=0; i<size; i++){
    yield i*4 + 0;
    yield i*4 + 1;
    yield i*4 + 2;
    yield i*4 + 2;
    yield i*4 + 1;
    yield i*4 + 3;
  }
}