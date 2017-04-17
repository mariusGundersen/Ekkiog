import {vec2, mat3} from 'gl-matrix';

export interface XYScale {
  x : number,
  y : number,
  r : number
};

export interface PosScale {
  pos : [number, number],
  r : number
};

export default class Perspective{
  mapToViewportMatrix : mat3;
  toClipSpaceMatrix : mat3;
  viewportToMapCenterMatrix : mat3;
  viewportToTileMatrix : mat3;
  tileToViewportMatrix : mat3;
  mapSize : vec2;
  halfMapSize : vec2;
  viewportSize : vec2;
  viewportAspectRatio : vec2;
  inverseViewportAspectRatio : vec2;
  constructor(){
    this.mapToViewportMatrix = mat3.create();

    this.toClipSpaceMatrix = mat3.create();
    this.viewportToMapCenterMatrix = mat3.create();
    this.viewportToTileMatrix = mat3.create();
    this.tileToViewportMatrix = mat3.create();

    this.mapSize = vec2.fromValues(1, 1);
    this.halfMapSize = vec2.fromValues(0.5, 0.5);

    this.viewportSize = vec2.fromValues(1, 1);
    this.viewportAspectRatio = vec2.fromValues(1, 1);
    this.inverseViewportAspectRatio = vec2.fromValues(1, 1);

    scaleSelf(this.mapToViewportMatrix, this.viewportAspectRatio);

    this.recalculateViewportToMapCenterMatrix();
  }

  get scale(){
    return this.mapToViewportMatrix[0];
  }

  set scale(scale){
    this.scaleBy(scale/this.mapToViewportMatrix[0]);
  }

  get viewportWidth(){
    return this.viewportSize[0];
  }

  reset(){
    this.mapToViewportMatrix[6] = 0;
    this.mapToViewportMatrix[7] = 0;
    this.scale = 16*128/this.viewportSize[0];
    this.recalculateViewportToMapCenterMatrix();
  }

  scaleBy(r : number){
    this.panZoomInMapSpace({
      pos: [0,0],
      r: 1
    },{
      pos: [0,0],
      r: r
    });
  }

  panZoom(previous : XYScale, next : XYScale){
    const previousCoord = transformPos(this.viewportToMapCenterMatrix, previous.x, previous.y);
    const nextCoord = transformPos(this.viewportToMapCenterMatrix, next.x, next.y);

    this.panZoomInMapSpace({
      pos: previousCoord,
      r: previous.r
    },{
      pos: nextCoord,
      r: next.r
    });
  }

  panZoomInMapSpace(previous : PosScale, next : PosScale){
    translateSelf(this.mapToViewportMatrix, next.pos);
    scaleSelf(this.mapToViewportMatrix, this.viewportAspectRatio);
    scaleSelfByInverseScalar(this.mapToViewportMatrix, previous.r);
    scaleSelfByScalar(this.mapToViewportMatrix, next.r);
    scaleSelf(this.mapToViewportMatrix, this.inverseViewportAspectRatio);
    translateSelfNegative(this.mapToViewportMatrix, previous.pos);

    this.recalculateViewportToMapCenterMatrix();
  }

  setViewport(width : number, height : number){
    vec2.set(this.viewportSize, width, height);

    mat3.fromTranslation(this.toClipSpaceMatrix, [-1, -1]);
    scaleSelf(this.toClipSpaceMatrix, [2/width, 2/height]);

    vec2.set(this.inverseViewportAspectRatio, 1, width/height);
    scaleSelf(this.mapToViewportMatrix, this.viewportAspectRatio);
    scaleSelf(this.mapToViewportMatrix, this.inverseViewportAspectRatio);
    vec2.set(this.viewportAspectRatio, 1, height/width);

    this.recalculateViewportToMapCenterMatrix();
  }

  setMapSize(width : number, height : number){
    vec2.set(this.mapSize, width, height);
    vec2.set(this.halfMapSize, width/2, height/2);

    this.recalculateViewportToTileMatrix();
  }

  tileToViewport(...pos : Array<number>){
    return vec2.transformMat3(pos as any, pos, this.tileToViewportMatrix);
  }

  viewportToTile(...pos : number[]){
    return vec2.transformMat3(pos as any, pos, this.viewportToTileMatrix) as any as [number, number];
  }

  viewportToTileFloored(...pos : number[]){
    pos = this.viewportToTile(...pos);
    return [Math.floor(pos[0]), Math.floor(pos[1])];
  }

  recalculateViewportToMapCenterMatrix(){
    const aspect = this.viewportAspectRatio[1];
    const scale = minmax(0.1, this.mapToViewportMatrix[0], 100);
    this.mapToViewportMatrix[0] = scale;
    this.mapToViewportMatrix[4] = scale/aspect;
    this.mapToViewportMatrix[6] = minmax(-1, this.mapToViewportMatrix[6]/scale, 1)*scale;
    this.mapToViewportMatrix[7] = minmax(-1, this.mapToViewportMatrix[7]/scale*aspect, 1)*scale/aspect;

    mat3.invert(this.viewportToMapCenterMatrix, this.mapToViewportMatrix);
    mat3.multiply(this.viewportToMapCenterMatrix, this.viewportToMapCenterMatrix, this.toClipSpaceMatrix);

    this.recalculateViewportToTileMatrix();
  }

  recalculateViewportToTileMatrix(){
    mat3.copy(this.viewportToTileMatrix, this.viewportToMapCenterMatrix);
    this.viewportToTileMatrix[6] += 1;
    this.viewportToTileMatrix[7] += 1;
    scaleSelf(this.viewportToTileMatrix, this.halfMapSize);
    this.viewportToTileMatrix[6] *= this.halfMapSize[0];
    this.viewportToTileMatrix[7] *= this.halfMapSize[1];

    this.recalculateTileToViewportMatrix();
  }

  recalculateTileToViewportMatrix(){
    mat3.invert(this.tileToViewportMatrix, this.viewportToTileMatrix);
  }
}

function transformPos(matrix : mat3, ...pos : number[]) : [number, number] {
  return vec2.transformMat3(pos as any, pos, matrix) as any;
}

function translateSelf(matrix : mat3, pos : [number, number]){
  return mat3.translate(matrix, matrix, pos as any);
}

function translateSelfNegative(matrix : mat3, [x, y] : [number, number]){
  return mat3.translate(matrix, matrix, [-x, -y]);
}

function scaleSelf(matrix : mat3, scale : number[] | vec2){
  return mat3.scale(matrix, matrix, scale);
}

function scaleSelfByScalar(matrix : mat3, r : number){
  return mat3.scale(matrix, matrix, [r, r]);
}

function scaleSelfByInverseScalar(matrix : mat3, r : number){
  return mat3.scale(matrix, matrix, [1/r, 1/r]);
}

function minmax(min : number, v : number, max : number){
  return v < min ? min : v > max ? max : v;
}