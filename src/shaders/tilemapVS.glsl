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

precision mediump float;

attribute vec2 position;
attribute vec2 texture;
varying vec2 pixelCoord;
varying vec2 texCoord;
uniform mat3 matrix;
uniform vec2 mapTextureSize;
uniform float tileSize;

void main(void) {
  pixelCoord = texture * mapTextureSize * tileSize;
  texCoord = texture;
  vec2 clipSpace = (matrix * vec3(position, 1)).xy;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}