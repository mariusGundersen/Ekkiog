export interface Identifiable {
  readonly id: number
}

export interface Pos {
  readonly x: number,
  readonly y: number,
  readonly tx: number,
  readonly ty: number
}

export interface PointerDownEvent extends Pos, Identifiable {

}

export interface PointerMoveEvent extends Pos, Identifiable {

}

export interface PointerUpEvent extends Identifiable {

}

export interface CancelPanZoomEvent extends Identifiable {

}
