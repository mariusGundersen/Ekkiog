precision mediump float;

uniform sampler2D gates;
uniform sampler2D netCharges;
varying vec2 mapCoord;

vec4 nand(vec4 a, vec4 b);

void main() {
  if(floor(mapCoord.x*256.0) == 0.0 && floor(mapCoord.y*256.0) == 0.0){
    gl_FragColor = vec4(0.0);
    return;
  }

  vec4 netCoords = texture2D(gates, mapCoord);
  vec4 chargeA = texture2D(netCharges, netCoords.xy);
  vec4 chargeB = texture2D(netCharges, netCoords.zw);
  gl_FragColor = nand(chargeA, chargeB);
}


vec4 nand(vec4 a, vec4 b){
  return vec4(a.x == 0.0 || b.x == 0.0 ? 1.0 : 0.0, 0.0, 0.0, 0.0);
}