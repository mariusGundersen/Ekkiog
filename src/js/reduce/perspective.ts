import { mat2d, vec2, mat3, vec3 } from "gl-matrix";

export type Pair = [ number, number ];

export type TileViewPair = {
  readonly tilePos: Pair,
  readonly viewPos: Pair
}

export interface Perspective {
  readonly width: number
  readonly height: number
  readonly viewportToSquareMatrix: mat2d;
  readonly viewportFromSquareMatrix: mat2d;
  readonly squareToMapMatrix: mat2d;
  readonly squareFromMapMatrix: mat2d;
  readonly mapToTileMatrix: mat2d;
  readonly mapFromTileMatrix: mat2d;
  readonly clipToSquareMatrix: mat2d;
  readonly clipFromSquareMatrix: mat2d;
  readonly viewportToClipMatrix: mat2d;
}

const verticalFlipMatrix = mat2d.fromScaling(mat2d.create(), [1, -1]);

export const initialPerspective: Perspective = setMapSize({
  width: 100,
  height: 100,
  viewportToSquareMatrix: mat2d.create(),
  viewportFromSquareMatrix: mat2d.create(),
  squareToMapMatrix: mat2d.fromScaling(mat2d.create(), [1, 1]),
  squareFromMapMatrix: mat2d.fromScaling(mat2d.create(), [1, 1]),
  mapToTileMatrix: mat2d.create(),
  mapFromTileMatrix: mat2d.create(),
  clipToSquareMatrix: mat2d.create(),
  clipFromSquareMatrix: mat2d.create(),
  viewportToClipMatrix: mat2d.create(),
}, 128);

/** Resets to fit tiles in viewport */
export function fitBox(perspective: Perspective, top: number, left: number, right: number, bottom: number){
  const topLeft = [left, top] as Pair;
  const bottomRight = [right, bottom] as Pair;
  return transformTileToView(perspective, [
    {tilePos: topLeft, viewPos: [0,0]},
    {tilePos: bottomRight, viewPos: [perspective.width, perspective.height]}
  ]);
}


export function setViewport(perspective: Perspective, width: number, height: number){

  const upperLeft = viewportToTile(perspective, 0, 0);
  const upperRight = viewportToTile(perspective, perspective.width, 0);

  /*
    viewportToClip:
    [ 2/w    0  -1 ]   [x]   [x]
    [  0    2/h -1 ] X [y] = [y]
    [  0     0   1 ]   [1]   [1]
  */

  const viewportToClipMatrix = mat2d.fromValues(2/width, 0, 0, 2/height, -1, -1);

  /*
    correctAspect:
    [ 1   0   0 ]   [x]   [x]
    [ 0  h/w  0 ] X [y] = [y]
    [ 0   0   1 ]   [1]   [1]
  */

  const clipToSquareMatrix = mat2d.fromValues(1, 0, 0, height/width, 0, 0);
  const clipFromSquareMatrix = mat2d.invert(mat2d.create(), clipToSquareMatrix);

  if(!clipFromSquareMatrix) return perspective;

  const viewportToSquareMatrix = mat2d.create();
  mat2d.mul(viewportToSquareMatrix, verticalFlipMatrix, viewportToClipMatrix);
  mat2d.mul(viewportToSquareMatrix, clipToSquareMatrix, viewportToSquareMatrix);
  const viewportFromSquareMatrix = mat2d.invert(mat2d.create(), viewportToSquareMatrix);

  if(!viewportFromSquareMatrix) return perspective;

  return transformTileToView({
    ...perspective,
    width,
    height,
    clipToSquareMatrix,
    clipFromSquareMatrix,
    viewportToSquareMatrix,
    viewportFromSquareMatrix
  },[
    {tilePos: upperLeft, viewPos: [0, 0]},
    {tilePos: upperRight, viewPos: [width, 0]}
  ]);
}

export function transformTileToView(perspective: Perspective, posPairs: TileViewPair[]){
  if(posPairs.length === 0) return perspective;
  if(posPairs.length === 1) return transformOne(perspective, posPairs[0]);
  return transformMany(perspective, posPairs);
}

function transformMany(perspective: Perspective, posPairs: TileViewPair[]){
  /*
  Calculate squareToMap by solving the equation
  squareToMap * squarePos = tileToMap * tilePos
  squareToMap * squarePos = mapPos
  [ s 0 x ]   [s_x_a  s_x_b  s_x_c]   [m_x_a  m_x_b  m_x_c]
  [ 0 s y ] x [s_y_a  s_y_b  s_y_c] = [m_y_a  m_y_b  m_y_c]
  [ 0 0 1 ]   [    1      1      1]   [    1      1      1]

  s*s_x_a + x = m_x_a
  s*s_x_b + x = m_x_b
  s*s_x_c + x = m_x_c
  s*s_y_a + y = m_y_a
  s*s_y_b + y = m_y_b
  s*s_y_c + y = m_y_c

  [ s_x_a 1 0 ] [ s ]   [ m_x_a ]
  [ s_x_b 1 0 ] [ x ] = [ m_x_b ]
  [ s_x_c 1 0 ] [ y ]   [ m_x_c ]
  [ s_y_a 0 1 ]         [ m_y_a ]
  [ s_y_b 0 1 ]         [ m_y_b ]
  [ s_y_c 0 1 ]         [ m_y_c ]

  (At*A)i*At*b
  Ai*Ati*At*b
  Ai*b

  [L*3][3] = [L]
  [3*L][L*3][3] = [3*L][L]
  [3*3][3] = [3]

  */

  const mapPos = vec2.create();
  const squarePos = vec2.create();
  const len = posPairs.length;
  let m00=0, m01=0, m02=0;
  let v0=0, v1=0, v2=0;
  for(const {viewPos, tilePos} of posPairs){
    vec2.transformMat2d(squarePos, viewPos, perspective.viewportToSquareMatrix);
    m00 += squarePos[0]*squarePos[0] + squarePos[1]*squarePos[1];
    m01 += squarePos[0];
    m02 += squarePos[1];
    vec2.transformMat2d(mapPos, tilePos, perspective.mapFromTileMatrix);
    v0 += mapPos[0]*squarePos[0] + mapPos[1]*squarePos[1];
    v1 += mapPos[0];
    v2 += mapPos[1];
  }
  const mat = mat3.fromValues(
    m00, m01, m02,
    m01, len,   0,
    m02,   0, len);
  const vec = vec3.fromValues(v0, v1, v2);
  mat3.invert(mat, mat);
  vec3.transformMat3(vec, vec, mat);
  const s = minmax(0.001, vec[0], 2);
  const squareToMapMatrix = mat2d.fromValues(s, 0, 0, s, minmax(-1, vec[1], 1), minmax(-1, vec[2], 1));
  const squareFromMapMatrix = mat2d.invert(mat2d.create(), squareToMapMatrix);

  if(!squareFromMapMatrix) return perspective;
  return {
    ...perspective,
    squareToMapMatrix,
    squareFromMapMatrix
  }
}

function transformOne(perspective: Perspective, {tilePos, viewPos}: TileViewPair){

  /*
  squareToMap * viewportToSquare * viewportPos = tileToMap * tilePos
  squareToMap * squarePos = tileToMap * tilePos
  squareToMap * squarePos = mapPos
  [ s 0 x ]   [s_x]   [m_x]
  [ 0 s y ] x [s_y] = [m_y]
  [ 0 0 1 ]   [ 1 ]   [ 1 ]

  m_x = s*s_x + x
  m_y = s*s_y + y

  x = m_x - s*s_x
  y = m_y - s*s_y

  1 > x > -1
  1 > y > -1
  */
  const mapPos = vec2.create();
  const squarePos = vec2.create();

  vec2.transformMat2d(mapPos, tilePos, perspective.mapFromTileMatrix);
  vec2.transformMat2d(squarePos, viewPos, perspective.viewportToSquareMatrix);

  const s = perspective.squareToMapMatrix[0] //reuse existing scale
  const x = mapPos[0] - s*squarePos[0];
  const y = mapPos[1] - s*squarePos[1];
  const squareToMapMatrix = mat2d.fromValues(s, 0, 0, s, minmax(-1, x, 1), minmax(-1, y, 1));
  const squareFromMapMatrix = mat2d.invert(mat2d.create(), squareToMapMatrix);

  if(!squareFromMapMatrix) return perspective;
  return {
    ...perspective,
    squareToMapMatrix,
    squareFromMapMatrix
  };
}

/**
 * tilePos = mapToTile * squarePos
 * tilePos = (mapToTile * verticalFlip) * squarePos
 */
function setMapSize(perspective: Perspective, size: number): Perspective {
  /*
  mapToTile:
  [ 64   0  64 ]   [x]   [x]
  [  0  64  64 ] X [y] = [y]
  [  0   0   1 ]   [1]   [1]
  */
  const half = size/2;
  const mapToTileMatrix = mat2d.fromValues(half, 0, 0, half, half, half);
  mat2d.mul(mapToTileMatrix, mapToTileMatrix, verticalFlipMatrix);

  const mapFromTileMatrix = mat2d.invert(mat2d.create(), mapToTileMatrix);

  return mapFromTileMatrix ? {
    ...perspective,
    mapToTileMatrix,
    mapFromTileMatrix
  } : perspective;
}

/**
 * tilePos = mapToTile * squareToMap * viewportToSquare * viewportPos
 * tilePos = (mapToTile * verticalFlip) * squareToMap * (clipToSquare * verticalFlip * viewportToClip) * viewportPos
 */
export function viewportToTile(perspective: Perspective, x: number, y: number): Pair {
  const vec = [x, y] as any as vec2;
  vec2.transformMat2d(vec, vec, perspective.viewportToSquareMatrix);
  vec2.transformMat2d(vec, vec, perspective.squareToMapMatrix);
  vec2.transformMat2d(vec, vec, perspective.mapToTileMatrix);
  return vec as any as Pair;
}

/**
 * viewportPos = viewportFromSquare * squareFromMap * mapFromTile * tilePos
 * viewportPos = (viewportFromClip * verticalFlip * clipFromSquare) * squareFromMap * (verticalFlip * mapFromTile) * tilePos
 */
export function tileToViewport(perspective: Perspective, x: number, y: number): Pair{
  const vec = [x, y] as any as vec2;
  vec2.transformMat2d(vec, vec, perspective.mapFromTileMatrix);
  vec2.transformMat2d(vec, vec, perspective.squareFromMapMatrix);
  vec2.transformMat2d(vec, vec, perspective.viewportFromSquareMatrix);
  return vec as any as Pair;
}


/**
 * clipPos = clipFromSquare * squareFromMap * verticalFlip * mapPos
 */
export function recalculate(perspective: Perspective){
  const mapToViewportMatrix = mat3.fromMat2d(mat3.create(), verticalFlipMatrix);
  mul2d(mapToViewportMatrix, perspective.squareFromMapMatrix,mapToViewportMatrix);
  mul2d(mapToViewportMatrix, perspective.clipFromSquareMatrix,mapToViewportMatrix);
  return mapToViewportMatrix;
}


function mul2d(out : mat3, a : mat2d, b : mat3) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
      b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = b2;
  out[3] = a0 * b3 + a2 * b4;
  out[4] = a1 * b3 + a3 * b4;
  out[5] = b5;
  out[6] = a0 * b6 + a2 * b7 + a4;
  out[7] = a1 * b6 + a3 * b7 + a5;
  out[8] = b8;

  return out;
}

export const minmax = (a : number, b : number, c : number) => b < a ? a : b > c ? c : b;