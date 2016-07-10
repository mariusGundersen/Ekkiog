/*
* Copyright (c) 2012 Brandon Jones
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
*    1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
*    2. Altered source versions must be plainly marked as such, and must not
*    be misrepresented as being the original software.
*
*    3. This notice may not be removed or altered from any source
*    distribution.
*/

export default class ShaderWrapper {
  constructor(gl, program) {
    this.program = program;
    this.attribute = {};
    this.uniform = {};

    const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attributeCount; i++) {
        const attrib = gl.getActiveAttrib(program, i);
        this.attribute[attrib.name] = gl.getAttribLocation(program, attrib.name);
    }

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
        const uniform = gl.getActiveUniform(program, i);
        const name = uniform.name.replace("[0]", "");
        this.uniform[name] = gl.getUniformLocation(program, name);
    }
  }

  static createFromSource(gl, vertexShaderSource, fragmentShaderSource) {
    const shaderProgram = gl.createProgram();
    const vs = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fs = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    gl.attachShader(shaderProgram, vs);
    gl.attachShader(shaderProgram, fs);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Shader program failed to link\n", gl.getProgramInfoLog(shaderProgram));
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }

    return new ShaderWrapper(gl, shaderProgram);
  };
}

export function compileShader(gl, source, type) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const typeString = type === gl.VERTEX_SHADER
      ? "VERTEX_SHADER"
      : "FRAGMENT_SHADER";
    console.error(typeString, gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
