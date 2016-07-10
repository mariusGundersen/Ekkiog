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
varying vec2 pixelCoord;
varying vec2 texCoord;
uniform sampler2D tiles;
uniform sampler2D sprites;
uniform vec2 inverseTileTextureSize;
uniform vec2 inverseSpriteTextureSize;
uniform float tileSize;
void main(void) {
  vec4 tile = texture2D(tiles, texCoord);
  if(tile.x == 1.0 && tile.y == 1.0) { discard; }
  vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;
  vec2 spriteCoord = mod(pixelCoord, tileSize);
  gl_FragColor = texture2D(sprites, (spriteOffset + spriteCoord) * inverseSpriteTextureSize);
}