precision mediump float;

uniform sampler2D tilemap;
uniform vec2 inverseTileTextureSize;
varying vec2 texCoord;

void main() {
  vec4 value = texture2D(tilemap, texCoord);
  vec2 tile = vec2(
    value.x*4.0
    + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( 0.0, -1.0)).x * 1.0
    + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( 1.0,  0.0)).x * 2.0,
    value.y*4.0
    + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( 0.0,  1.0)).x * 1.0
    + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2(-1.0,  0.0)).x * 2.0);

  gl_FragColor = vec4(tile, 0.0, 1.0);
}
