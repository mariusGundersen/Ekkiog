import {vec2, mat3} from 'gl-matrix';

export default class Perspective{
  constructor({width, height, tileSize}){
    this.matrix = mat3.create();
    this.mapSize = vec2.fromValues(width, height);
    this.halfMapSize = vec2.fromValues(width/2, height/2);
    this.tileSize = vec2.fromValues(tileSize, tileSize);
    this.inverseTileSize = vec2.fromValues(1/tileSize, 1/tileSize);
    this.viewportSize = vec2.fromValues(1, 1);
    this.inverseHalfViewportSize = vec2.fromValues(2, 2);
    this.negativeHalfViewportSize = vec2.fromValues(-0.5, -0.5);
    this.position = vec2.fromValues(0, 0);
    this.negativePosition = vec2.fromValues(0, 0);
    this.scale = vec2.fromValues(1, 1);
    this.inverseScale = vec2.fromValues(0.5, 0.5);
    this.flip = vec2.fromValues(1, -1);

    this.recalculate();
  }

  translateBy(x, y){
    vec2.set(this.position, this.position[0] + x, this.position[1] + y);
    vec2.set(this.negativePosition, this.negativePosition[0] - x, this.negativePosition[1] + y);
    this.recalculate();
  }

  scaleBy(scale){
    vec2.scale(this.scale, this.scale, scale);
    this.inverseScale[0] = 0.5/this.scale[0];
    this.inverseScale[1] = 0.5/this.scale[1];
    this.recalculate();
  }

  setViewport(width, height){
    vec2.set(this.viewportSize, width, height);
    vec2.set(this.inverseHalfViewportSize, 2/width, 2/height);
    vec2.set(this.negativeHalfViewportSize, -width/2, -height/2);
    this.recalculate();
  }

  get mapToViewportMatrix(){
    return this.matrix;
  }

  viewportToMap(x, y){
    const matrix = mat3.create();
    mat3.translate(matrix, matrix, this.halfMapSize);
    mat3.scale(matrix, matrix, this.inverseTileSize);
    mat3.scale(matrix, matrix, this.inverseScale);
    mat3.translate(matrix, matrix, this.position);
    mat3.translate(matrix, matrix, this.negativeHalfViewportSize);
    mat3.translate(matrix, matrix, vec2.fromValues(x, y));

    return [Math.floor(matrix[6]), Math.floor(matrix[7])];
  }

  recalculate(){
    mat3.fromScaling(this.matrix, this.inverseHalfViewportSize);
    mat3.translate(this.matrix, this.matrix, this.negativePosition);
    mat3.scale(this.matrix, this.matrix, this.flip);
    mat3.scale(this.matrix, this.matrix, this.scale);
    mat3.scale(this.matrix, this.matrix, this.mapSize);
    mat3.scale(this.matrix, this.matrix, this.tileSize);
  }
}