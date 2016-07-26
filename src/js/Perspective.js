import {vec2, mat3} from 'gl-matrix';

export default class Perspective{
  constructor({width, height}){
    this.matrix = mat3.create();
    this.reverseMatrix = mat3.create();

    this.mapSize = vec2.fromValues(width, height);
    this.halfMapSize = vec2.fromValues(width/2, height/2);

    this.viewportSize = vec2.fromValues(1, 1);
    this.viewportAspectRatio = vec2.fromValues(1, 1);
    this.inverseViewportAspectRatio = vec2.fromValues(1, 1);

    mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);

    mat3.invert(this.reverseMatrix, this.matrix);
  }

  panZoom(previous, next){
    const previousCoord = this.viewportToMap(previous.x, previous.y);
    const nextCoord = this.viewportToMap(next.x, next.y);

    mat3.translate(this.matrix, this.matrix, [nextCoord[0], nextCoord[1]]);
    mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);
    mat3.scale(this.matrix, this.matrix, [1/previous.r, 1/previous.r]);
    mat3.scale(this.matrix, this.matrix, [next.r, next.r]);
    mat3.scale(this.matrix, this.matrix, this.inverseViewportAspectRatio);
    mat3.translate(this.matrix, this.matrix, [-previousCoord[0], -previousCoord[1]]);

    mat3.invert(this.reverseMatrix, this.matrix);
  }

  setViewport(width, height){
    vec2.set(this.viewportSize, width, height);

    vec2.set(this.inverseViewportAspectRatio, 1, width/height);
    mat3.scale(this.matrix, this.matrix, this.viewportAspectRatio);
    mat3.scale(this.matrix, this.matrix, this.inverseViewportAspectRatio);
    vec2.set(this.viewportAspectRatio, 1, height/width);

    mat3.invert(this.reverseMatrix, this.matrix);
  }

  get mapToViewportMatrix(){
    return this.matrix;
  }

  viewportToTile(x, y){
    const pos = this.viewportToMap(x, y);

    vec2.add(pos, pos, [1, 1]);
    vec2.multiply(pos, pos, this.halfMapSize);

    return [Math.floor(pos[0]), Math.floor(pos[1])];
  }

  viewportToMap(x, y){
    const pos = this.toClipSpace(x, y);
    vec2.transformMat3(pos, pos, this.reverseMatrix);
    return pos;
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
