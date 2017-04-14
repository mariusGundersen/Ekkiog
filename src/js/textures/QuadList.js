import ndarray from 'ndarray';
import createBuffer from 'gl-buffer';
import createVAO from 'gl-vao';

export default class QuadList {
  constructor(gl, size){
    this.gl = gl;
    this.size = size;
    this.vertices = new Float32Array(size*16);
    this.vertexBuffer = createBuffer(gl, this.vertices);
    this.indecies = new Uint16Array(createQuads(size));
    this.indexBuffer = createBuffer(gl, this.indecies, gl.ELEMENT_ARRAY_BUFFER);
    this.vao = createVAO(gl, [
      {
        buffer: this.vertexBuffer,
        type: gl.FLOAT,
        size: 4
      }
    ], this.indexBuffer, gl.UNSIGNED_SHORT);
    this.map = ndarray(this.vertices, [size, 4, 2, 2]);
    this.count = 0;
    this.prevCount = 0;
  }

  set(index, quad){
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

  remove(start, count){
    this.vertices.copyWithin(start*16, (start+count)*16, this.count*16);
    this.count -= count;
  }

  bind(){
    this.vao.bind();
  }

  update(){
    if(this.count !== this.prevCount){
      this.vertexBuffer.bind();
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
      this.prevCount = this.count;
    }
  }

  draw(){
    this.bind();
    this.vao.draw(this.gl.TRIANGLES, this.count*6);
  }
}

export function* createQuads(size){
  for(let i=0; i<size; i++){
    yield i*4 + 0;
    yield i*4 + 1;
    yield i*4 + 2;
    yield i*4 + 2;
    yield i*4 + 1;
    yield i*4 + 3;
  }
}