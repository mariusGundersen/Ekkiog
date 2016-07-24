precision mediump float;

uniform sampler2D tilemap;
uniform vec2 inverseTileTextureSize;
varying vec2 texCoord;

float lookup(float x, float y);

void main() {
  float value = lookup(0.0, 0.0);

  //Tile
  if(value == 1.0){

    bool up = lookup(0.0, -1.0) == 1.0;
    bool left = lookup(-1.0, 0.0) == 1.0 || lookup(-1.0, 0.0) == 2.0;
    bool down = lookup(0.0, 1.0) == 1.0;
    bool right = lookup(1.0, 0.0) == 1.0 || lookup(4.0, 1.0) == 2.0 || lookup(4.0, -1.0) == 2.0;

    vec2 tile = vec2(
      1.0
      + (up ? 1.0 : 0.0)
      + (right ? 2.0 : 0.0),
      0.0
      + (down ? 1.0 : 0.0)
      + (left ? 2.0 : 0.0));

    gl_FragColor = vec4(tile/255.0, 0.0, 1.0);

  //Gate
  }else if(lookup(3.0, 1.0) == 2.0){
    gl_FragColor = vec4(0.0/255.0, 4.0/255.0, 0.0, 1.0);
  }else if(lookup(2.0, 1.0) == 2.0){
    gl_FragColor = vec4(1.0/255.0, 4.0/255.0, 0.0, 1.0);
  }else if(lookup(1.0, 1.0) == 2.0){
    gl_FragColor = vec4(2.0/255.0, 4.0/255.0, 0.0, 1.0);
  }else if(lookup(0.0, 1.0) == 2.0){
    gl_FragColor = vec4(3.0/255.0, 4.0/255.0, 0.0, 1.0);
  }else if(lookup(3.0, 0.0) == 2.0){
    gl_FragColor = vec4(0.0/255.0, 5.0/255.0, 0.0, 1.0);
  }else if(lookup(2.0, 0.0) == 2.0){
    gl_FragColor = vec4(1.0/255.0, 5.0/255.0, 0.0, 1.0);
  }else if(lookup(1.0, 0.0) == 2.0){
    gl_FragColor = vec4(2.0/255.0, 5.0/255.0, 0.0, 1.0);
  }else if(lookup(0.0, 0.0) == 2.0){
    gl_FragColor = vec4(3.0/255.0, 5.0/255.0, 0.0, 1.0);
  }else if(lookup(3.0, -1.0) == 2.0){
    gl_FragColor = vec4(0.0/255.0, 6.0/255.0, 0.0, 1.0);
  }else if(lookup(2.0, -1.0) == 2.0){
    gl_FragColor = vec4(1.0/255.0, 6.0/255.0, 0.0, 1.0);
  }else if(lookup(1.0, -1.0) == 2.0){
    gl_FragColor = vec4(2.0/255.0, 6.0/255.0, 0.0, 1.0);
  }else if(lookup(0.0, -1.0) == 2.0){
    gl_FragColor = vec4(3.0/255.0, 6.0/255.0, 0.0, 1.0);

  //Empty
  }else{
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}


float lookup(float x, float y) {
  return floor(texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( x, y)).x*256.0);
}