precision highp float;

uniform sampler2D netMap;
uniform sampler2D netCharges;
varying vec2 mapCoord;
uniform sampler2D spriteSheet;
uniform vec2 inverseSpriteTextureSize;

void main() {
  vec4 netCoord = texture2D(netMap, mapCoord);
  float charge = texture2D(netCharges, netCoord.xy).x;
  float hue = netCoord.xy == vec2(0.0, 0.0) ? 6.0 : floor(mod(netCoord.x*256.0, 6.0));
  vec4 color = texture2D(spriteSheet, vec2(1.0, 1.0) - vec2(charge+1.0, hue+1.0) * inverseSpriteTextureSize);
  gl_FragColor = vec4(color.rgb, charge);
}
