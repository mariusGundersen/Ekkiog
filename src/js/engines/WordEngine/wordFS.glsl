precision highp float;

uniform sampler2D spriteSheet;
uniform sampler2D chargeMap;
uniform vec2 inverseSpriteTextureSize;
uniform float tileSize;

varying vec2 uv;
varying vec2 texCoord;

void main(void) {
  vec4 color = texture2D(spriteSheet, uv*inverseSpriteTextureSize);

  if(color.r == 1.0 && color.g == 0.0 && color.b == 1.0){
    vec4 charge = texture2D(chargeMap, texCoord);
    gl_FragColor = vec4(charge.rgb, 1.0);
  }else{
    gl_FragColor = color;
  }

}
