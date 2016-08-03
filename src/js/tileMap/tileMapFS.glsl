precision mediump float;

const float TILE = 1.0;
const float GATE = 2.0;
const float UNDERPASS = 3.0;

uniform sampler2D tilemap;
uniform vec2 inverseTileTextureSize;
varying vec2 texCoord;

float lookup(float x, float y);
vec4 gateTile(float x, float y);

void main() {
  float value = lookup(0.0, 0.0);

  if(value == TILE || value == UNDERPASS){
    float tileUp    = lookup( 0.0, -1.0);
    float tileDown  = lookup( 0.0,  1.0);
    float tileLeft  = lookup(-1.0,  0.0);
    float tileRight = lookup( 1.0,  0.0);

    float up = value == TILE
      ? float(tileUp == TILE) + float(tileUp == UNDERPASS)*4.0
      : float(tileUp == TILE || tileUp == UNDERPASS)*5.0;
    float down = value == TILE
      ? float(tileDown == TILE) + float(tileDown == UNDERPASS)*4.0
      : float(tileDown == TILE || tileDown == UNDERPASS)*5.0;
    float left = float(tileLeft == TILE || tileLeft == UNDERPASS || tileLeft == GATE);
    float right = float(tileRight == TILE || tileRight == UNDERPASS || lookup(4.0, 1.0) == GATE || lookup(4.0, -1.0) == GATE);

    vec2 tile = vec2(
      1.0 + up + right*2.0,
      0.0 + down + left*2.0);

    gl_FragColor = vec4(tile/255.0, 0.0, 1.0);

  //Gate
  }else if(lookup(3.0, 1.0) == GATE){
    gl_FragColor = gateTile(0.0, 0.0);
  }else if(lookup(2.0, 1.0) == GATE){
    gl_FragColor = gateTile(1.0, 0.0);
  }else if(lookup(1.0, 1.0) == GATE){
    gl_FragColor = gateTile(2.0, 0.0);
  //}else if(lookup(0.0, 1.0) == GATE){
  //  gl_FragColor = gateTile(3.0, 0.0);
  }else if(lookup(3.0, 0.0) == GATE){
    gl_FragColor = gateTile(0.0, 1.0);
  }else if(lookup(2.0, 0.0) == GATE){
    gl_FragColor = gateTile(1.0, 1.0);
  }else if(lookup(1.0, 0.0) == GATE){
    gl_FragColor = gateTile(2.0, 1.0);
  }else if(lookup(0.0, 0.0) == GATE){
    gl_FragColor = gateTile(3.0, 1.0);
  }else if(lookup(3.0, -1.0) == GATE){
    gl_FragColor = gateTile(0.0, 2.0);
  }else if(lookup(2.0, -1.0) == GATE){
    gl_FragColor = gateTile(1.0, 2.0);
  }else if(lookup(1.0, -1.0) == GATE){
    gl_FragColor = gateTile(2.0, 2.0);
  //}else if(lookup(0.0, -1.0) == GATE){
  //  gl_FragColor = gateTile(3.0, 2.0);

  //Empty
  }else{
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}

float lookup(float x, float y) {
  return floor(texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( x, y)).x*256.0);
}

vec4 gateTile(float x, float y){
  return vec4((9.0+x)/255.0, (4.0+y)/255.0, 0.0, 1.0);
}