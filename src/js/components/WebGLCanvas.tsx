import * as React from 'react';
import { Dispatch } from 'redux';

import style from './main.css';

import {
  panZoom,
  fitBox,
  Action
} from '../actions';
import { SelectionState } from '../reduce/selection';
import { ContextState } from '../reduce/context';

import startShell, { Config } from '../shell';
import Engine from '../engines/Engine';
import TouchControls from '../interaction';
import moveHandler from '../editing/moveHandler';
import forestHandler from '../editing/forestHandler';
import { ContextMenuState } from '../reduce/contextMenu';
import buttonHandler from '../editing/buttonHandler';
import createRef from './createRef';
import { fromEvent, of, merge } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { viewportToTile, recalculate } from '../reduce/perspective';
import { ViewState } from '../reduce/view';
import { mat3 } from 'gl-matrix';

export interface Props{
  readonly tickInterval: number,
  readonly step: number,
  readonly view: ViewState,
  readonly selection: SelectionState,
  readonly contextMenu: ContextMenuState,
  readonly currentContext: ContextState,
  readonly dispatch: Dispatch<Action>
}

export default class WebGLCanvas extends React.Component<Props, any> {
  private canvas = createRef<HTMLCanvasElement>();
  private engine!: Engine;
  private touchControls!: TouchControls;
  private shellConfig!: Config
  private mapToViewportMatrix!: mat3;

  componentDidMount(){
    if(!this.canvas.current) return
    const gl = getContext(this.canvas.current);
    this.engine = new Engine(gl, this.props.view.pixelWidth, this.props.view.pixelHeight);

    const touches = getTouchEvents(
      this.canvas.current,
      (x, y) => viewportToTile(this.props.view.perspective, x, y)
    );

    this.touchControls = new TouchControls(touches, this.props.dispatch);

    forestHandler(undefined, this.props.currentContext.forest, this.engine);

    this.shellConfig = startShell({
      tickInterval: this.props.tickInterval,
      render: (delta: number) => {
        const ease = this.props.currentContext.ease.next(delta);
        if(ease.done){
          const changed = this.touchControls.getChangedTouches();
          if(changed.length){
            this.props.dispatch(panZoom(changed));
            return;
          }
        }else{
          this.props.dispatch(fitBox(ease.value));
          return;
        }

        this.engine.render(this.mapToViewportMatrix);

        if(this.props.selection.selection){
          this.engine.renderMove(
            this.mapToViewportMatrix,
            this.props.selection,
            this.props.selection.dx,
            this.props.selection.dy);
        }
      },
      tick: tickCount => {
        this.engine.simulate(tickCount);
      },
      resize: () => {}
    });
  }

  componentWillReceiveProps(nextProps: Props){
    const currentContext = this.props.currentContext;
    const nextContext = nextProps.currentContext;

    this.shellConfig.setTickInterval(nextProps.tickInterval);

    forestHandler(currentContext.forest, nextContext.forest, this.engine);
    moveHandler(this.props.selection, nextProps.selection, this.engine);
    buttonHandler(currentContext.buttonTree, nextContext.buttonTree, this.engine);

    this.touchControls.setSelection(nextProps.selection);

    if(nextProps.contextMenu.type === 'show' || nextProps.selection.selection){
      this.touchControls.disable();
    }else{
      this.touchControls.enable();
    }

    this.shellConfig.tick(nextProps.step - this.props.step);
    this.mapToViewportMatrix = recalculate(nextProps.view.perspective);

    this.engine.render(this.mapToViewportMatrix);

    if(nextProps.selection.selection){
      this.engine.renderMove(
        this.mapToViewportMatrix,
        nextProps.selection,
        nextProps.selection.dx,
        nextProps.selection.dy);
    }
  }

  shouldComponentUpdate(nextProps: Props){
    return nextProps.view.pixelWidth != this.props.view.pixelWidth
        || nextProps.view.pixelHeight != this.props.view.pixelHeight;
  }

  render(){
    if(this.engine){
      this.engine.setViewport(this.props.view.pixelWidth, this.props.view.pixelHeight);
    }

    return (
      <canvas
        className={style.canvas}
        ref={this.canvas}
        width={this.props.view.pixelWidth}
        height={this.props.view.pixelHeight} />
    );
  }
};

function getContext(canvas: HTMLCanvasElement) {
  return canvas.getContext("webgl", {})
      || canvas.getContext("experimental-webgl", {})
      || (() => {throw new Error("no webgle here")})();
}

function getTouchEvents(canvas: HTMLCanvasElement, viewportToTile: (x: number, y: number) => [number, number]){
  return merge(
    fromEvent<TouchEvent>(canvas, 'touchstart'),
    fromEvent<TouchEvent>(canvas, 'touchmove'),
    fromEvent<TouchEvent>(canvas, 'touchend')
  ).pipe(
    tap(e => e.preventDefault()),
    switchMap(handle(viewportToTile))
  );
}

function handle(viewportToTile: (x: number, y: number) => [number, number]){
  return (event: TouchEvent) => of(...Array.from(event.changedTouches)
    .map(touch => {
      const x = touch.pageX * window.devicePixelRatio;
      const y = touch.pageY * window.devicePixelRatio;
      const [tx, ty] = viewportToTile(x, y);
      return {
        type: event.type,
        id: touch.identifier,
        x,
        y,
        tx,
        ty
      };
    }))
}

function arrayToBox([top, left, right, bottom]: number[]){
  return {top, left, right, bottom};
}
