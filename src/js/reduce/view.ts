import {
  Action
} from '../actions';
import { Perspective, initialPerspective, setViewport, transformTileToView, fitBox } from './perspective';

export interface ViewState {
  readonly pixelWidth: number,
  readonly pixelHeight: number,
  readonly perspective: Perspective
}

const initialState: ViewState = {
  pixelWidth: 100,
  pixelHeight: 100,
  perspective: initialPerspective
};

export default function view(state = initialState, action: Action): ViewState {
  switch(action.type){
    case 'panZoom':
      return {
        ...state,
        perspective: transformTileToView(state.perspective, action.changed)
      }
    case 'resize':
      return {
        pixelWidth: action.pixelWidth,
        pixelHeight: action.pixelHeight,
        perspective: setViewport(state.perspective, action.pixelWidth, action.pixelHeight)
      };
    case 'fitBox':
      return {
        ...state,
        perspective: fitBox(state.perspective, action.top, action.left, action.right, action.bottom)
      }
    default:
      return state;
  }
}