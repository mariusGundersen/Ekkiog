import {vec2, mat3} from 'gl-matrix';

export default class Perspective{
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

  scaleBy(r){
    this.panZoomInMapSpace({
      pos: [0,0],
      r: 1
    },{
      pos: [0,0],
      r: r
    });
  }

  panZoom(previous, next){
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

  panZoomInMapSpace(previous, next){
    translateSelf(this.mapToViewportMatrix, next.pos);
    scaleSelf(this.mapToViewportMatrix, this.viewportAspectRatio);
    scaleSelfByInverseScalar(this.mapToViewportMatrix, previous.r);
    scaleSelfByScalar(this.mapToViewportMatrix, next.r);
    scaleSelf(this.mapToViewportMatrix, this.inverseViewportAspectRatio);
    translateSelfNegative(this.mapToViewportMatrix, previous.pos);

    this.recalculateViewportToMapCenterMatrix();
  }

  setViewport(width, height){
    vec2.set(this.viewportSize, width, height);

    mat3.fromTranslation(this.toClipSpaceMatrix, [-1, -1]);
    scaleSelf(this.toClipSpaceMatrix, [2/width, 2/height]);

    vec2.set(this.inverseViewportAspectRatio, 1, width/height);
    scaleSelf(this.mapToViewportMatrix, this.viewportAspectRatio);
    scaleSelf(this.mapToViewportMatrix, this.inverseViewportAspectRatio);
    vec2.set(this.viewportAspectRatio, 1, height/width);

    this.recalculateViewportToMapCenterMatrix();
  }

  setMapSize(width, height){
    vec2.set(this.mapSize, width, height);
    vec2.set(this.halfMapSize, width/2, height/2);

    this.recalculateViewportToTileMatrix();
  }

  tileToViewport(...pos){
    return vec2.transformMat3(pos, pos, this.tileToViewportMatrix);
  }

  viewportToTile(...pos){
    return vec2.transformMat3(pos, pos, this.viewportToTileMatrix);
  }

  viewportToTileFloored(...pos){
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

function transformPos(matrix, ...pos){
  return vec2.transformMat3(pos, pos, matrix);
}

function translateSelf(matrix, pos){
  return mat3.translate(matrix, matrix, pos);
}

function translateSelfNegative(matrix, [x, y]){
  return mat3.translate(matrix, matrix, [-x, -y]);
}

function scaleSelf(matrix, scale){
  return mat3.scale(matrix, matrix, scale);
}

function scaleSelfByScalar(matrix, r){
  return mat3.scale(matrix, matrix, [r, r]);
}

function scaleSelfByInverseScalar(matrix, r){
  return mat3.scale(matrix, matrix, [1/r, 1/r]);
}

function minmax(min, v, max){
  return v < min ? min : v > max ? max : v;
}