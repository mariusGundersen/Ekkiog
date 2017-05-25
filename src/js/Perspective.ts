import {vec2, vec3, mat3, mat2d} from 'gl-matrix';
import { Box } from 'ekkiog-editing';

export type PosXY = [ number, number ];
export type SquarePos = PosXY;
export type MapPos = PosXY;

/*
                                            mapToTile
                                 clipToMap       |
                correctAspect        |           |
    viewportToClip    |              |           |
         |            |              |           |
viewPort -> clipSpace -> aspectRatio -> mapSpace ->  tile
  0,0    ->   -1,1    ->    -1,.8    ->   -1,1   ->   0,0
400,300  ->    0,0    ->     0,0     ->    0,0   ->  64,64
800,600  ->    1,-1   ->     1,-.8   ->    1,-1  -> 128,128

viewportToClip:
[ 1/w    0   -1 ]   [x]   [x]
[   0  -1/h   1 ] X [y] = [y]
[   0    0    1 ]   [1]   [1]

correctAspect:
[ 1   0   0 ]   [x]   [x]
[ 0  h/w  0 ] X [y] = [y]
[ 0   0   1 ]   [1]   [1]

clipToMap:
[ s  0  x ]   [x]   [x]
[ 0  s  y ] X [y] = [y]
[ 0  0  1 ]   [1]   [1]

mapToTile:
[ 64    0  64 ]   [x]   [x]
[  0  -64  64 ] X [y] = [y]
[  0    0   1 ]   [1]   [1]


tilePos     =    mapToTile     * verticalFlip *  clipToMap  * verticalFlip * viewportToClip * viewportPos
viewportPos = viewportFromClip * verticalFlip * clipFromMap * verticalFlip *   mapFromTile  *   tilePos
*/

export default class Perspective{
  readonly mapToViewportMatrix : mat3;
  private readonly viewportToSquareMatrix : mat2d;
  private readonly viewportFromSquareMatrix : mat2d;
  private readonly verticalFlipMatrix : mat2d;
  private readonly mapToTileMatrix : mat2d;
  private readonly mapFromTileMatrix : mat2d;
  private readonly squareToMapMatrix : mat2d;
  private readonly squareFromMapMatrix : mat2d;
  private readonly clipToSquareMatrix : mat2d;
  private readonly clipFromSquareMatrix : mat2d;
  private readonly viewportToClipMatrix : mat2d;
  constructor(){
    this.verticalFlipMatrix = mat2d.create();
    this.viewportToSquareMatrix = mat2d.create();
    this.viewportFromSquareMatrix = mat2d.create();
    this.mapToTileMatrix = mat2d.create();
    this.mapFromTileMatrix = mat2d.create();
    this.squareToMapMatrix = mat2d.create();
    this.squareFromMapMatrix = mat2d.create();
    this.clipToSquareMatrix = mat2d.create();
    this.clipFromSquareMatrix = mat2d.create();
    this.viewportToClipMatrix = mat2d.create();

    this.mapToViewportMatrix = mat3.create();

    mat2d.fromScaling(this.verticalFlipMatrix, [1, -1]);
    mat2d.fromScaling(this.squareToMapMatrix, [1, 1]);
    mat2d.invert(this.squareFromMapMatrix, this.squareToMapMatrix);

    this.setMapSize(128);
  }

  /** Resets to fit tiles in viewport */
  reset({top, left, bottom, right} : Box){
    const topLeft = [left, top] as PosXY;
    const bottomRight = [right, bottom] as PosXY;
    vec2.transformMat2d(topLeft as any, topLeft, this.mapFromTileMatrix);
    vec2.transformMat2d(bottomRight as any, bottomRight, this.mapFromTileMatrix);
    this.transformMapToSquare(
      [topLeft, [-1,1]],
      [bottomRight, [ 1,-1]]
    );
  }

  /**
   * squarePos = viewportToSquare * viewportPos
   * squarePos = (clipToSquare * viewportToClip * verticalFlip) * viewportPos
   */
  setViewport(width : number, height : number){
    /*
      viewportToClip:
      [ 2/w    0  -1 ]   [x]   [x]
      [  0    2/h -1 ] X [y] = [y]
      [  0     0   1 ]   [1]   [1]
    */

    mat2d.set(this.viewportToClipMatrix, 2/width, 0, 0, 2/height, -1, -1);

    /*
      correctAspect:
      [ 1   0   0 ]   [x]   [x]
      [ 0  h/w  0 ] X [y] = [y]
      [ 0   0   1 ]   [1]   [1]
    */

    mat2d.set(this.clipToSquareMatrix, 1, 0, 0, height/width, 0, 0);
    mat2d.invert(this.clipFromSquareMatrix, this.clipToSquareMatrix);

    mat2d.mul(this.viewportToSquareMatrix, this.verticalFlipMatrix, this.viewportToClipMatrix);
    mat2d.mul(this.viewportToSquareMatrix, this.clipToSquareMatrix, this.viewportToSquareMatrix);
    mat2d.invert(this.viewportFromSquareMatrix, this.viewportToSquareMatrix);

    this.recalculate();
  }

  /*
   * tilePos = mapToTile * squarePos
   * tilePos = (mapToTile * verticalFlip) * squarePos
   */
  setMapSize(size : number){
    /*
    mapToTile:
    [ 64   0  64 ]   [x]   [x]
    [  0  64  64 ] X [y] = [y]
    [  0   0   1 ]   [1]   [1]
    */
    mat2d.set(this.mapToTileMatrix, size/2, 0, 0, size/2, size/2, size/2);
    mat2d.mul(this.mapToTileMatrix, this.mapToTileMatrix, this.verticalFlipMatrix);

    mat2d.invert(this.mapFromTileMatrix, this.mapToTileMatrix);

    this.recalculate();
  }

  transformMapToSquare(...pos : [MapPos, SquarePos][]){
    if(pos.length === 0) return;
    if(pos.length === 1){
      /*

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
      const s = this.squareToMapMatrix[0] //reuse existing scale
      const x = pos[0][0][0] - s*pos[0][1][0];
      const y = pos[0][0][1] - s*pos[0][1][1];
      mat2d.set(this.squareToMapMatrix, s, 0, 0, s, minmax(-1, x, 1), minmax(-1, y, 1));
      mat2d.invert(this.squareFromMapMatrix, this.squareToMapMatrix);

      this.recalculate();
      return;
    }

    /*
    Calculate squareToMap by solving the equation
    mapPos = squareToMap * squarePos
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

    const len = pos.length;
    let m00=0, m01=0, m02=0, m11=0,m12=0,m22=0;
    let v0=0, v1=0, v2=0;
    for(let i=0; i<len; i++){
      m00 += pos[i][1][0]*pos[i][1][0] + pos[i][1][1]*pos[i][1][1];
      m01 += pos[i][1][0];
      m02 += pos[i][1][1];
      v0 += pos[i][0][0]*pos[i][1][0] + pos[i][0][1]*pos[i][1][1];
      v1 += pos[i][0][0];
      v2 += pos[i][0][1];
    }
    const mat = mat3.fromValues(
      m00, m01, m02,
      m01, len,   0,
      m02,   0, len);
    const vec = vec3.fromValues(v0, v1, v2);
    mat3.invert(mat, mat);
    vec3.transformMat3(vec, vec, mat);
    const s = minmax(0.001, vec[0], 2);
    mat2d.set(this.squareToMapMatrix, s, 0, 0, s, minmax(-1, vec[1], 1), minmax(-1, vec[2], 1));
    mat2d.invert(this.squareFromMapMatrix, this.squareToMapMatrix);

    this.recalculate();
  }

  get transformation(){
    return {
      x: this.squareToMapMatrix[4],
      y: this.squareToMapMatrix[5],
      s: this.squareToMapMatrix[0]
    };
  }

  set transformation({x, y, s} : {x : number, y: number, s : number}){
    mat2d.set(this.squareToMapMatrix, s, 0, 0, s, x, y);
    mat2d.invert(this.squareFromMapMatrix, this.squareToMapMatrix);

    this.recalculate();
  }

  /**
   * squarePos = viewportToSquare * viewportPos
   * squarePos = (clipToSquare * viewportToClip * verticalFlip) * viewportPos
   */
  viewportToSquare(...pos : number[]) : SquarePos {
    let vec = pos as any as vec2;
    vec2.transformMat2d(vec, vec, this.viewportToSquareMatrix);
    return vec as any as PosXY;
  }

  /**
   * mapPos = squareToMap * viewportToSquare * viewportPos
   * mapPos = squareToMap * (clipToSquare * viewportToClip * verticalFlip) * viewportPos
   */
  viewportToMap(...pos : number[]) : MapPos {
    let vec = pos as any as vec2;
    vec2.transformMat2d(vec, vec, this.viewportToSquareMatrix);
    vec2.transformMat2d(vec, vec, this.squareToMapMatrix);
    return vec as any as PosXY;
  }

  /**
   * tilePos = mapToTile * squareToMap * viewportToSquare * viewportPos
   * tilePos = (mapToTile * verticalFlip) * squareToMap * (clipToSquare * verticalFlip * viewportToClip) * viewportPos
   */
  viewportToTile(...pos : number[]) : PosXY{
    let vec = pos as any as vec2;
    vec2.transformMat2d(vec, vec, this.viewportToSquareMatrix);
    vec2.transformMat2d(vec, vec, this.squareToMapMatrix);
    vec2.transformMat2d(vec, vec, this.mapToTileMatrix);
    return vec as any as PosXY;
  }

  viewportToTileFloored(...pos : number[]) : PosXY{
    pos = this.viewportToTile(...pos);
    return [pos[0]|0, pos[1]|0];
  }

  /**
   * viewportPos = viewportFromSquare * squareFromMap * mapFromTile * tilePos
   * viewportPos = (viewportFromClip * verticalFlip * clipFromSquare) * squareFromMap * (verticalFlip * mapFromTile) * tilePos
   */
  tileToViewport(...pos : number[]) : PosXY{
    let vec = pos as any as vec2;
    vec2.transformMat2d(vec, vec, this.mapFromTileMatrix);
    vec2.transformMat2d(vec, vec, this.squareFromMapMatrix);
    vec2.transformMat2d(vec, vec, this.viewportFromSquareMatrix);
    return vec as any as PosXY;
  }

  /**
   * clipPos = clipFromSquare * squareFromMap * verticalFlip * mapPos
   */
  private recalculate(){
    mat3.fromMat2d(this.mapToViewportMatrix, this.verticalFlipMatrix);
    mul2d(this.mapToViewportMatrix, this.squareFromMapMatrix, this.mapToViewportMatrix);
    mul2d(this.mapToViewportMatrix, this.clipFromSquareMatrix, this.mapToViewportMatrix);
  }
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

function minmax(a : number, b : number, c : number){
  return b < a ? a
       : b > c ? c
       : b;
}