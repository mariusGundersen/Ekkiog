
export type ResizeAction = {
  readonly type : 'resize',
  readonly pixelWidth : number,
  readonly pixelHeight : number
}
export const resize = (pixelWidth : number, pixelHeight : number) : ResizeAction => ({
  type: 'resize',
  pixelWidth,
  pixelHeight
});
export type PanZoomAction = {
  readonly type : 'panZoom',
  readonly tileToViewport : (...pos : number[]) => [number, number],
  readonly viewportToTileFloored : (...pos : number[]) => [number, number],
  readonly transform : {x : number, y : number, s : number}
}
export const panZoom = (
  tileToViewport : (...pos : number[]) => [number, number],
  viewportToTileFloored : (...pos : number[]) => [number, number],
  transform : {x : number, y : number, s : number}
) : PanZoomAction => ({
  type: 'panZoom',
  tileToViewport,
  viewportToTileFloored,
  transform
});

export type ViewActions =
  PanZoomAction |
  ResizeAction;