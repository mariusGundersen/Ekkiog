import {vec2, mat3} from 'gl-matrix';

export default class Perspective{
  constructor({width, height, tileSize}){
    this.matrix = mat3.create();
    this.reverseMatrix = mat3.create();

    this.mapSize = vec2.fromValues(width, height);
    this.halfMapSize = vec2.fromValues(width/2, height/2);

    this.tileSize = vec2.fromValues(tileSize, tileSize);
    this.inverseTileSize = vec2.fromValues(1/tileSize, 1/tileSize);

    this.viewportSize = vec2.fromValues(1, 1);
    this.inverseHalfViewportSize = vec2.fromValues(2, 2);
    this.negativeHalfViewportSize = vec2.fromValues(-0.5, -0.5);
    this.viewportAspectRatio = vec2.fromValues(1, 1);

    this.position = vec2.fromValues(0, 0);
    this.negativePosition = vec2.fromValues(0, 0);

    this.scale = vec2.fromValues(1, 1);
    this.inverseScale = vec2.fromValues(0.5, 0.5);

    this.flip = vec2.fromValues(1, -1);

    this.center = vec2.fromValues(0, 0);
    this.centerClipSpace = vec2.fromValues(0, 0);
    //this.panZoomMatrix = mat3.create();

    //mat3.scale(this.matrix, this.matrix, [2, 2]);
    mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);

    this.recalculate();
  }

  translateBy(x, y){
    const [cx, cy] = this.toClipSpace(x, y);
    //console.log('translate', cx, cy);
    vec2.add(this.position, this.position, [cx+1, cy+1]);
    //vec2.add(this.negativePosition, this.negativePosition, [-x, -y]);
    //vec2.subtract(this.centerClipSpace, this.centerClipSpace, [cx/2+0.5, cy/2+0.5]);
    //mat3.translate(this.panZoomMatrix, this.panZoomMatrix, [cx+1, cy+1]);
    //this.recalculate();
  }

  scaleBy(scale){
    vec2.scale(this.scale, this.scale, scale);
    //this.inverseScale[0] = 0.5/this.scale[0];
    //this.inverseScale[1] = 0.5/this.scale[1];
    //mat3.scale(this.panZoomMatrix, this.panZoomMatrix, [1/scale, 1/scale]);
    //mat3.scale(this.matrix, this.matrix, [1/scale, 1/scale]);
    console.log('scaleBy', scale);
    mat3.translate(this.matrix, this.matrix, [this.centerClipSpace[0], this.centerClipSpace[1]]);
    mat3.scale(this.matrix, this.matrix, scale);
    mat3.translate(this.matrix, this.matrix, [-this.centerClipSpace[0], -this.centerClipSpace[1]]);
    this.recalculate();
  }

  panZoom(previous, next){
    const r = next.r/previous.r;
    console.log('panZoom', previous, next);
    const previousCoord = this.viewportToMap(previous.x, previous.y);
    const nextCoord = this.viewportToMap(next.x, next.y);
    console.log('panZoom', previousCoord, nextCoord, r);
    //mat3.identity(this.matrix);
    mat3.translate(this.matrix, this.matrix, [nextCoord[0], nextCoord[1]]);
    mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);
    mat3.scale(this.matrix, this.matrix, [1/previous.r, 1/previous.r]);
    mat3.scale(this.matrix, this.matrix, [next.r, next.r]);
    mat3.scale(this.matrix, this.matrix, [1/this.viewportAspectRatio[0], 1/this.viewportAspectRatio[1]]);
    mat3.translate(this.matrix, this.matrix, [-previousCoord[0], -previousCoord[1]]);
    this.recalculate();
    console.log(mat3.str(this.matrix));
  }

  setCenter(x, y){
    //const [cx, cy] = this.toClipSpace(x, y);
    const clipCoord = this.toClipSpace(x, y);
    const mapCoord = this.viewportToMap(x,y);
    console.log('setCenter', mapCoord);
    //vec2.set(this.center, ...mapCoord);
    //const diff = vec2.fromValues(this.centerClipSpace[0], this.centerClipSpace[1]);
    const diff = vec2.fromValues(...this.position);
    vec2.add(diff, diff, [clipCoord[0], clipCoord[1]]);
    //vec2.multiply(diff, diff, this.scale);
    //vec2.multiply(diff, diff, this.viewportAspectRatio);

    vec2.set(this.centerClipSpace, clipCoord[0], clipCoord[1]);
    vec2.subtract(this.position, this.position, diff);
    console.log('position', this.position);

    //vec2.add(diff, diff, [1, 1]);
    vec2.multiply(diff, diff, this.halfMapSize);
    console.log('setCenter-diff', diff);

    //vec2.add(this.centerClipSpace, this.centerClipSpace, this.position);
    //vec2.subtract(this.position, this.position, this.centerClipSpace);
    //mat3.fromTranslation(this.panZoomMatrix, [cx, cy]);
    //mat3.scale(this.panZoomMatrix, this.panZoomMatrix, [1/this.scale, 1/this.scale]);
  }

  setViewport(width, height){
    vec2.set(this.viewportSize, width, height);
    vec2.set(this.inverseHalfViewportSize, 2/width, 2/height);
    vec2.set(this.negativeHalfViewportSize, -width/2, -height/2);
    mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);
    vec2.set(this.viewportAspectRatio, 1, height/width);
    mat3.scale(this.matrix, this.matrix, [1, width/height]);
    this.recalculate();
  }

  get mapToViewportMatrix(){
    return this.matrix;
  }

  viewportToTile(x, y){
    const pos = this.viewportToMap(x, y);
    vec2.add(pos, pos, [1, 1]);
    vec2.multiply(pos, pos, this.halfMapSize);
    console.log('viewportToTile', pos);
    return [Math.floor(pos[0]), Math.floor(pos[1])];
  }

  viewportToMap(x, y){
    const pos = this.toClipSpace(x, y);
    vec2.transformMat3(pos, pos, this.reverseMatrix);
    return pos;
  }

  recalculate(){
    //mat3.identity(this.matrix);
    //mat3.scale(this.matrix, this.matrix, this.flip);
    //mat3.translate(this.matrix, this.matrix, this.position);
    //mat3.translate(this.matrix, this.matrix, [this.center[0]*this.scale[0], this.center[1]*this.scale[1]]);
    //mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);
    //mat3.translate(this.matrix, this.matrix, [this.centerClipSpace[0], this.centerClipSpace[1]]);
    //mat3.scale(this.matrix, this.matrix, this.scale);
    //mat3.translate(this.matrix, this.matrix, [-this.centerClipSpace[0], -this.centerClipSpace[1]]);
    //mat3.translate(this.matrix, this.matrix, [-this.center[0], -this.center[1]]);
    //mat3.multiply(this.matrix, this.matrix, this.panZoomMatrix);
    //mat3.scale(this.matrix, this.matrix, this.mapSize);
    //mat3.scale(this.matrix, this.matrix, this.tileSize);

    //const centerClipSpace = vec2.create();
    //vec2.transformMat3(centerClipSpace, this.center, this.matrix);
    //console.log('recalculate', centerClipSpace);

    //mat3.identity(this.matrix);
    //mat3.translate(this.matrix, this.matrix, this.position);
    //mat3.translate(this.matrix, this.matrix, [centerClipSpace[0], centerClipSpace[1]]);
    //mat3.scale(this.matrix, this.matrix, this.scale);
    //mat3.translate(this.matrix, this.matrix, [-centerClipSpace[0], -centerClipSpace[1]]);
    //mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);


    mat3.invert(this.reverseMatrix, this.matrix);
  }

  toClipSpace(x, y){
    return [
      x/this.viewportSize[0]*2 - 1,
      y/this.viewportSize[1]*2 - 1
    ];
  }

  fromClipSpace(x, y){
    return [
      (x+1)*this.viewportSize[0]/2,
      (y+1)*this.viewportSize[1]/2
    ]
  }
}
