precision mediump float;

varying vec2 pixelCoord;
varying vec2 texCoord;
uniform vec4 boundingBox;
uniform sampler2D tileMap;
uniform sampler2D spriteSheet;
uniform sampler2D chargeMap;
uniform vec2 inverseSpriteTextureSize;
uniform vec2 mapTextureSize;
uniform float tileSize;

void main(void) {
  if(texCoord.x > 1.0 || texCoord.y > 1.0){
    discard;
  }

  vec2 tilePos = floor(texCoord * mapTextureSize);
  vec2 spriteOffset;

  if(tilePos.y < boundingBox.x
  || tilePos.x < boundingBox.y
  || tilePos.y > boundingBox.w
  || tilePos.x > boundingBox.z){
    spriteOffset = vec2(6.0, 9.0) * tileSize;
  }else if(tilePos.y == boundingBox.x
        && tilePos.x == boundingBox.y){
    spriteOffset = vec2(5.0, 8.0) * tileSize;
  }else if(tilePos.y == boundingBox.w
        && tilePos.x == boundingBox.z){
    spriteOffset = vec2(7.0, 10.0) * tileSize;
  }else if(tilePos.y == boundingBox.w
        && tilePos.x == boundingBox.y){
    spriteOffset = vec2(5.0, 10.0) * tileSize;
  }else if(tilePos.y == boundingBox.x
        && tilePos.x == boundingBox.z){
    spriteOffset = vec2(7.0, 8.0) * tileSize;
  }else if(tilePos.y == boundingBox.x){
    spriteOffset = vec2(6.0, 8.0) * tileSize;
  }else if(tilePos.x == boundingBox.y){
    spriteOffset = vec2(5.0, 9.0) * tileSize;
  }else if(tilePos.x == boundingBox.z){
    spriteOffset = vec2(7.0, 9.0) * tileSize;
  }else if(tilePos.y == boundingBox.w){
    spriteOffset = vec2(6.0, 10.0) * tileSize;
  }else{
    vec4 tile = texture2D(tileMap, texCoord);
    spriteOffset = floor(tile.xy * 256.0) * tileSize;
  }

  vec2 spriteCoord = mod(pixelCoord, tileSize);

  vec4 color = texture2D(spriteSheet, (spriteOffset + spriteCoord) * inverseSpriteTextureSize);

  if(color.r == 1.0 && color.g == 0.0 && color.b == 1.0){
    vec4 charge = texture2D(chargeMap, texCoord);
    gl_FragColor = charge*vec4(1.0, 1.0, 1.0, 0.5);
  }else{
    gl_FragColor = color*vec4(1.0, 1.0, 1.0, 0.5);
  }
}
