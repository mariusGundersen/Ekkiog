precision mediump float;

uniform sampler2D gates;
uniform sampler2D netCharges;
varying vec2 mapCoord;

void main() {
  vec4 netCoord = texture2D(gates, mapCoord);
  vec4 chargeA = texture2D(netCharges, netCoord.rg);
  vec4 chargeB = texture2D(netCharges, netCoord.ba);

  // NAND
  if(chargeA.x == 0.0 || chargeB.x == 0.0){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
  }else{
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}
