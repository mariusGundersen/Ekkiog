import { TileViewPair } from "../reduce/perspective";

export interface ResizeAction {
  readonly type: 'resize',
  readonly pixelWidth: number,
  readonly pixelHeight: number
}
export const resize = (pixelWidth: number, pixelHeight: number): ResizeAction => ({
  type: 'resize',
  pixelWidth,
  pixelHeight
});

export interface PanZoomAction {
  readonly type: 'panZoom',
  readonly changed: TileViewPair[]
}
export const panZoom = (changed: TileViewPair[]): PanZoomAction => ({
  type: 'panZoom',
  changed
});

export interface FitBoxAction {
  readonly type: 'fitBox',
  readonly top: number,
  readonly left: number,
  readonly right: number,
  readonly bottom: number
}
export const fitBox = ([top, left, right, bottom]: number[]): FitBoxAction => ({
  type: 'fitBox',
  top,
  left,
  right,
  bottom
});

export type ViewActions =
  PanZoomAction |
  ResizeAction |
  FitBoxAction;