precision highp float;

varying vec2 pixelCoord;
varying vec2 texCoord;
uniform sampler2D tileMap;
uniform sampler2D spriteSheet;
uniform sampler2D chargeMap;
uniform vec2 spriteTextureSize;
uniform vec2 inverseSpriteTextureSize;
uniform float tileSize;

void main(void) {
  vec2 tileCoord = floor(texCoord*spriteTextureSize)*inverseSpriteTextureSize;
  if(tileCoord.x >= 1.0 || tileCoord.y >= 1.0){
    discard;
  }

  vec4 tile = texture2D(tileMap, tileCoord);
  vec2 spriteOffset = floor(tile.xy * 255.0) * tileSize;
  vec2 spriteCoord = mod(pixelCoord, tileSize);
  vec4 color = texture2D(spriteSheet, (spriteOffset + spriteCoord) * inverseSpriteTextureSize);

  if(color.a == 0.0){
    if(spriteCoord.x >= tileSize/2.0-1.0
    && spriteCoord.x < tileSize/2.0+1.0
    && spriteCoord.y >= tileSize/2.0-1.0
    && spriteCoord.y < tileSize/2.0+1.0)
      gl_FragColor = vec4(50.0/255.0, 54.0/255.0, 58.0/255.0, 1.0);
    else
      gl_FragColor = vec4(42.0/255.0, 45.0/255.0, 48.0/255.0, 1.0);
  }else if(color.r == 1.0 && color.g == 0.0 && color.b == 1.0){
    vec4 charge = texture2D(chargeMap, tileCoord);
    gl_FragColor = vec4(charge.rgb, 1.0);
  }else{
    gl_FragColor = color;
  }
}
