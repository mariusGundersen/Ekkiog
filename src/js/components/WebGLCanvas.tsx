import * as React from 'react';
import { Dispatch } from 'redux';

import style from './main.css';

import {
  resize,
  panZoom,
  Action
} from '../actions';
import { SelectionState } from '../reduce/selection';
import { ContextState, ParentContextState } from '../reduce/context';

import Perspective from '../Perspective';
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

export interface Props{
  readonly tickInterval: number,
  readonly step: number,
  readonly width: number,
  readonly height: number,
  readonly selection: SelectionState,
  readonly contextMenu: ContextMenuState,
  readonly currentContext: ContextState,
  readonly previousContext?: ParentContextState
  readonly dispatch: Dispatch<Action>
}

export default class WebGLCanvas extends React.Component<Props, any> {
  private canvas = createRef<HTMLCanvasElement>();
  private engine!: Engine;
  private touchControls!: TouchControls;
  private shellConfig!: Config

  componentDidMount(){
    if(!this.canvas.current) return
    const gl = getContext(this.canvas.current);
    const perspective = new Perspective();
    this.engine = new Engine(gl, this.props.width, this.props.height);

    const touches = getTouchEvents(
      this.canvas.current,
      (x, y) => perspective.viewportToTile(x, y)
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
            perspective.transformTileToView(...changed);
            this.props.dispatch(panZoom(
              perspective.tileToViewport.bind(perspective),
              perspective.viewportToTile.bind(perspective)
            ));
          }
        }else{
          perspective.reset(arrayToBox(ease.value));
        }

        this.engine.render(perspective.mapToViewportMatrix);

        if(this.props.selection.selection){
          this.engine.renderMove(
            perspective.mapToViewportMatrix,
            this.props.selection,
            this.props.selection.dx,
            this.props.selection.dy);
        }
      },
      tick: tickCount => {
        this.engine.simulate(tickCount);
      },
      resize: (width, height) => {
        this.props.dispatch(resize(width, height));
        perspective.setViewport(width, height);

        this.props.dispatch(panZoom(
          perspective.tileToViewport.bind(perspective),
          perspective.viewportToTile.bind(perspective)
        ));
      }
    });

    perspective.reset(this.props.currentContext.boundingBox);
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
  }

  shouldComponentUpdate(nextProps: Props){
    return nextProps.width != this.props.width
        || nextProps.height != this.props.height;
  }

  render(){
    if(this.engine){
      this.engine.setViewport(this.props.width, this.props.height);
    }

    return (
      <canvas
        className={style.canvas}
        ref={this.canvas}
        width={this.props.width}
        height={this.props.height} />
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
