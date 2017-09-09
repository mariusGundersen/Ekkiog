
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
  readonly viewportToTile : (...pos : number[]) => [number, number]
}
export const panZoom = (
  tileToViewport : (...pos : number[]) => [number, number],
  viewportToTile : (...pos : number[]) => [number, number]
) : PanZoomAction => ({
  type: 'panZoom',
  tileToViewport,
  viewportToTile
});

export type ViewActions =
  PanZoomAction |
  ResizeAction;