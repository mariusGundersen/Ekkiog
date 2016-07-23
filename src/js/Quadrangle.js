import createBuffer from 'gl-buffer';

export default class Quadrangle{
  constructor(gl){
    this.gl = gl;

    this.buffer = createBuffer(gl, [
      //x  y  u  v
      -1, -1, 0, 1,
       1, -1, 1, 1,
       1,  1, 1, 0,

      -1, -1, 0, 1,
       1,  1, 1, 0,
      -1,  1, 0, 0
    ]);
  }

  bindShader(shader){
    shader.bind();
    this.buffer.bind();
    shader.attributes.position.pointer(this.gl.FLOAT, false, 16, 0);
    shader.attributes.texture.pointer(this.gl.FLOAT, false, 16, 8);
  }

  render(){
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}