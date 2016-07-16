
export default class Quadrangle{
  constructor(gl){
    this.gl = gl;

    this.quadVerts = new Float32Array([
      //x  y  u  v
      -1, -1, 0, 1,
       1, -1, 1, 1,
       1,  1, 1, 0,

      -1, -1, 0, 1,
       1,  1, 1, 0,
      -1,  1, 0, 0
    ]);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.quadVerts, gl.STATIC_DRAW);
  }

  bindShader(shader){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    this.gl.useProgram(shader.program);

    this.gl.enableVertexAttribArray(shader.attribute.position);
    this.gl.enableVertexAttribArray(shader.attribute.texture);
    this.gl.vertexAttribPointer(shader.attribute.position, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.vertexAttribPointer(shader.attribute.texture, 2, this.gl.FLOAT, false, 16, 8);
  }

  render(){
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}