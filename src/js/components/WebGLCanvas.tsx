import * as React from 'react';
import { Dispatch } from 'redux';
import { EventEmitter } from 'events';

import style from './main.css';

import {
  resize,
  panZoom,
  Action
} from '../actions';
import { SelectionState } from '../reduce/selection';
import { ContextState, ParentContextState } from '../reduce/context';
import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  TouchType
} from '../events';

import Perspective from '../Perspective';
import startShell, { Config } from '../shell';
import Engine from '../engines/Engine';
import TouchControls from '../interaction/TouchControls';
import moveHandler from '../editing/moveHandler';
import forestHandler from '../editing/forestHandler';
import fromEmitter from '../emitterRedux';
import { ContextMenuState } from '../reduce/contextMenu';
import buttonHandler from '../editing/buttonHandler';
import createRef from './createRef';

export interface Props{
  readonly tickInterval : number,
  readonly step : number,
  readonly width : number,
  readonly height : number,
  readonly selection : SelectionState,
  readonly contextMenu : ContextMenuState,
  readonly currentContext : ContextState,
  readonly previousContext? : ParentContextState
  readonly dispatch : Dispatch<Action>
}

export default class WebGLCanvas extends React.Component<Props, any> {
  private canvas = createRef<HTMLCanvasElement>();
  private engine! : Engine;
  private touchControls! : TouchControls;
  private shellConfig! : Config

  componentDidMount(){
    if(!this.canvas.current) return
    const gl = getContext(this.canvas.current);
    const perspective = new Perspective();
    this.touchControls = new TouchControls((x,y) => perspective.viewportToTile(x, y));
    this.engine = new Engine(gl, this.props.width, this.props.height);

    // The react event system is too slow, so using the native events
    this.canvas.current.addEventListener('touchstart', emit((e, v) => this.touchControls.emit(e, v), TOUCH_START), false)
    this.canvas.current.addEventListener('touchmove', emit((e, v) => this.touchControls.emit(e, v), TOUCH_MOVE), false);
    this.canvas.current.addEventListener('touchend', emit((e, v) => this.touchControls.emit(e, v), TOUCH_END), false);

    fromEmitter(this.touchControls.emitter, this.props.dispatch);
    forestHandler(undefined, this.props.currentContext.forest, this.engine);

    this.shellConfig = startShell({
      tickInterval : this.props.tickInterval,
      render: (delta : number) => {
        const ease = this.props.currentContext.ease.next(delta);
        if(ease.done){
          const changed = this.touchControls.panZoomSaga.process();
          if(changed){
            const posPairs = changed.map(({x, y, tilePos}) => ({
              tilePos,
              viewPos: [x, y] as [number, number]
            }));
            perspective.transformTileToView(...posPairs);
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
        const prevWidth = this.props.width;
        const tilePosA = perspective.viewportToTile(0, 0);
        const tilePosB = perspective.viewportToTile(prevWidth, 0);
        perspective.setViewport(width, height);

        perspective.transformTileToView(
          {tilePos: tilePosA, viewPos: [0, 0]},
          {tilePos: tilePosB, viewPos: [width, 0]});

        this.props.dispatch(panZoom(
          perspective.tileToViewport.bind(perspective),
          perspective.viewportToTile.bind(perspective)
        ));
      }
    });

    perspective.reset(this.props.currentContext.boundingBox);
  }

  componentWillReceiveProps(nextProps : Props){
    const currentContext = this.props.currentContext;
    const nextContext = nextProps.currentContext;

    this.shellConfig.setTickInterval(nextProps.tickInterval);

    forestHandler(currentContext.forest, nextContext.forest, this.engine);
    moveHandler(this.props.selection, nextProps.selection, this.engine);
    buttonHandler(currentContext.buttonTree, nextContext.buttonTree, this.engine);

    this.touchControls.selectionSaga.setSelection(nextProps.selection);

    if(nextProps.contextMenu.show || nextProps.selection.selection){
      this.touchControls.pointerSaga.disable();
    }else{
      this.touchControls.pointerSaga.enable();
    }

    this.shellConfig.tick(nextProps.step - this.props.step);
  }

  shouldComponentUpdate(nextProps : Props){
    return nextProps.width != this.props.width
        || nextProps.height != this.props.height;
  }

  componentWillUpdate(nextProps : Props){
    this.engine.setViewport(nextProps.width, nextProps.height);
  }

  render(){
    return (
      <canvas
        className={style.canvas}
        ref={this.canvas}
        width={this.props.width}
        height={this.props.height} />
    );
  }
};

function getContext(canvas : HTMLCanvasElement) {
  return canvas.getContext("webgl", {})
      || canvas.getContext("experimental-webgl", {})
      || (() => {throw new Error("no webgle here")})();
}

function emit(emit : (event : string, value: any) => void, type : TouchType){
  return (event : TouchEvent) => {
    for(let i=0; i < event.changedTouches.length; i++){
      let touch = event.changedTouches[i];
      emit(type, {
        id: touch.identifier,
        x: touch.pageX*window.devicePixelRatio,
        y: touch.pageY*window.devicePixelRatio
      });
    }

    event.preventDefault();
  }
}


function arrayToBox([top, left, right, bottom] : number[]){
  return {top, left, right, bottom};
}

