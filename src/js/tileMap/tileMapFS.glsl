precision mediump float;

uniform sampler2D tilemap;
uniform vec2 inverseTileTextureSize;
varying vec2 texCoord;

void main() {
  vec2 value = floor(texture2D(tilemap, texCoord).xy*256.0);

  //Empty
  if(value.x == 0.0 && value.y == 0.0){
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

  //Tile
  }else if(value.x == 1.0 && value.y == 0.0){
    vec2 tile = vec2(
      1.0/255.0
      + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( 0.0, -1.0)).x * 1.0
      + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( 1.0,  0.0)).x * 2.0,
      0.0
      + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( 0.0,  1.0)).x * 1.0
      + texture2D(tilemap, texCoord + inverseTileTextureSize * vec2(-1.0,  0.0)).x * 2.0);

    gl_FragColor = vec4(tile, 0.0, 1.0);

  //Gate
  }else{
    gl_FragColor = vec4(value.xy/255.0, 0.0, 1.0);
  }
}
