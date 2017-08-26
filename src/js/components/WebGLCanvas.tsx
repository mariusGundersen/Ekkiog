import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Dispatch } from 'redux';
import { Forest, Box } from 'ekkiog-editing';
import { EventEmitter } from 'events';

import style from './main.css';

import {
  resize,
  panZoom,
  simulationTick
} from '../actions';
import { State } from '../reduce';
import { SelectionState } from '../reducers/selection';
import { ContextState, PushedContextState } from '../reducers/context';
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
import { ContextMenuState } from '../reducers/contextMenu';
import ease, { Step, easeOut } from '../utils/ease';

export interface Props{
  readonly tickInterval : number,
  readonly width : number,
  readonly height : number,
  readonly selection : SelectionState,
  readonly contextMenu : ContextMenuState,
  readonly currentContext : ContextState,
  readonly previousContext? : PushedContextState
}

const WebGLCanvas = connect(
  ({view, context, selection, contextMenu, simulation} : State) : Props => ({
    selection,
    width: view.pixelWidth,
    height: view.pixelHeight,
    contextMenu,
    currentContext: context,
    previousContext: context.previous,
    tickInterval: simulation.tickInterval
  })
)(class WebGLCanvas extends React.Component<Props & {dispatch : Dispatch<State>}, any> {
  private canvas : HTMLCanvasElement | null;
  private engine : Engine;
  private perspective : Perspective;
  private touchControls : TouchControls;
  private shellConfig : Config
  private ease? : Step
  componentDidMount(){
    if(!this.canvas) return
    const gl = getContext(this.canvas);
    const emitter = new EventEmitter();
    this.engine = new Engine(gl);
    this.engine.setViewport(this.props.width, this.props.height);
    this.perspective = new Perspective();
    this.touchControls = new TouchControls(emitter, this.perspective);

    // The react event system is too slow, so using the native events
    this.canvas.addEventListener('touchstart', emit(emitter, TOUCH_START), false)
    this.canvas.addEventListener('touchmove', emit(emitter, TOUCH_MOVE), false);
    this.canvas.addEventListener('touchend', emit(emitter, TOUCH_END), false);

    fromEmitter(emitter, (x, y) => this.perspective.viewportToTile(x, y), this.props.dispatch, this.engine);

    this.shellConfig = startShell({
      tickInterval : this.props.tickInterval,
      render: (delta : number) => {
        if(this.ease){
          const box = this.ease(delta);
          if(box){
            this.perspective.reset(arrayToBox(box));
          }else{
            this.ease = undefined;
          }
        }
        const changed = this.touchControls.panZoomSaga.process();
        if(changed){
          this.props.dispatch(panZoom(
            this.perspective.tileToViewport.bind(this.perspective),
            this.perspective.viewportToTileFloored.bind(this.perspective),
            this.perspective.transformation));
        }

        this.engine.render(this.perspective.mapToViewportMatrix);

        if(this.props.selection.selection){
          this.engine.renderMove(
            this.perspective.mapToViewportMatrix,
            this.props.selection,
            this.props.selection.dx,
            this.props.selection.dy);
        }
      },
      tick: tickCount => {
        this.engine.simulate(tickCount);
        this.props.dispatch(simulationTick(tickCount));
      },
      resize: (pixelWidth, pixelHeight) => {
        this.props.dispatch(resize(pixelWidth, pixelHeight));
        const prevWidth = this.props.height;
        const mapPosA = this.perspective.viewportToMap(0, 0);
        const mapPosB = this.perspective.viewportToMap(prevWidth, 0);
        this.perspective.setViewport(pixelWidth, pixelHeight);
        const squarePosA = this.perspective.viewportToSquare(0, 0);
        const squarePosB = this.perspective.viewportToSquare(pixelWidth, 0);

        this.perspective.transformMapToSquare(
          [mapPosA, squarePosA],
          [mapPosB, squarePosB]);

        this.props.dispatch(panZoom(
          this.perspective.tileToViewport.bind(this.perspective),
          this.perspective.viewportToTileFloored.bind(this.perspective),
          this.perspective.transformation));
      }
    });
  }

  componentWillReceiveProps(nextProps : Props){
    const previousContext = this.props.previousContext;
    const currentContext = this.props.currentContext;
    const nextContext = nextProps.currentContext;

    this.shellConfig.setTickInterval(nextProps.tickInterval);

    forestHandler(currentContext.forest, nextContext.forest, this.engine);
    moveHandler(this.props.selection, nextProps.selection, this.engine);

    if(nextProps.selection.selection){
      if(!this.props.selection.selection
      || nextProps.selection.forest !== this.props.selection.forest){
        this.touchControls.selectionSaga.startSelection(nextProps.selection);
      }
    }

    if(!nextProps.selection.selection){
      if(this.props.selection.selection){
        this.touchControls.selectionSaga.stopSelection();
      }
    }

    if(nextProps.contextMenu.show !== this.props.contextMenu.show
    || nextProps.selection.selection !== this.props.selection.selection){
      if(nextProps.contextMenu.show || nextProps.selection.selection){
        this.touchControls.pointerSaga.disable();
      }else{
        this.touchControls.pointerSaga.enable();
      }
    }

    if(nextContext.boundingBox !== currentContext.boundingBox){
      if(previousContext && previousContext.name === nextContext.name){
        const from = scaleBox(nextContext.boundingBox, 0.5, previousContext.centerX, previousContext.centerY);
        this.perspective.reset(from);
        this.ease = ease(boxToArray(from), boxToArray(nextContext.boundingBox), easeOut, 200);
      }else if(nextProps.previousContext === undefined){
        this.perspective.reset(nextContext.boundingBox);
      }else if(nextProps.previousContext.name === currentContext.name){
        const from = scaleBox(nextContext.boundingBox, 1.5);
        this.perspective.reset(from);
        this.ease = ease(boxToArray(from), boxToArray(nextContext.boundingBox), easeOut, 200);
      }
    }
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
        ref={c => this.canvas = c}
        width={this.props.width}
        height={this.props.height} />
    );
  }
});

export default WebGLCanvas;

function getContext(canvas : HTMLCanvasElement) {
  return canvas.getContext("webgl", {})
      || canvas.getContext("experimental-webgl", {})
      || (() => {throw new Error("no webgle here")})();
}

function emit(emiter : EventEmitter, type : TouchType){
  return (event : TouchEvent) => {
    for(let i=0; i < event.changedTouches.length; i++){
      let touch = event.changedTouches[i];
      emiter.emit(type, {
        id: touch.identifier,
        x: touch.pageX*window.devicePixelRatio,
        y: touch.pageY*window.devicePixelRatio
      });
    }

    event.preventDefault();
  }
}

function boxToArray({top, left, right, bottom} : Box){
  return [top, left, right, bottom];
}

function arrayToBox([top, left, right, bottom] : number[]){
  return {top, left, right, bottom};
}

function scaleBox({top, left, right, bottom} : Box, scale : number, x = (left+right)/2, y = ((top+bottom)/2)){
  const w = right - left;
  const h = bottom - top;
  const scaleX = scale;
  const scaleY = h/w*scale;
  return {
    top: y - h/2*scaleY,
    left: x - w/2*scaleX,
    right: x + w/2*scaleX,
    bottom: y + h/2*scaleY
  };
}