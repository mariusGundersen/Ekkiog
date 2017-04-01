precision mediump float;

uniform sampler2D spriteSheet;
uniform vec2 inverseSpriteTextureSize;
uniform float tileSize;

varying vec2 uv;

void main(void) {
  gl_FragColor = texture2D(spriteSheet, vec2(15.0/16.0, 15.0/16.0) + uv*inverseSpriteTextureSize);
}
