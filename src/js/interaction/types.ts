export interface Identifiable {
  id : number
}

export interface Pos {
  x : number,
  y : number
}

export interface PointerDownEvent extends Pos, Identifiable {

}

export interface PointerMoveEvent extends Pos, Identifiable {

}

export interface PointerUpEvent extends Pos, Identifiable {

}

export interface CancelPanZoomEvent extends Identifiable {

}

export interface StartSelectionEvent {
  top : number,
  left : number,
  right : number,
  bottom : number
}