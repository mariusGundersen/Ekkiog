precision mediump float;

uniform sampler2D netMap;
uniform sampler2D netCharges;
varying vec2 mapCoord;

void main() {
  vec4 netCoord = texture2D(netMap, mapCoord);
  vec4 charge = texture2D(netCharges, netCoord.xy);
  float hue = netCoord.xy == vec2(0.0, 0.0) ? 6.0 : floor(mod(netCoord.x*256.0, 6.0));
  gl_FragColor = vec4(charge.x, hue/255.0, 0.0, 1.0);
}
