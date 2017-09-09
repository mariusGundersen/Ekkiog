import * as React from 'react';
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
import { ContextState, ParentContextState } from '../reducers/context';
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
  readonly previousContext? : ParentContextState
  readonly dispatch : Dispatch<State>
}

export default class WebGLCanvas extends React.Component<Props, any> {
  private canvas : HTMLCanvasElement | null;
  private engine : Engine;
  private perspective : Perspective;
  private touchControls : TouchControls;
  private shellConfig : Config
  private ease? : IterableIterator<number[]>

  componentDidMount(){
    if(!this.canvas) return
    const gl = getContext(this.canvas);
    const emitter = new EventEmitter();
    this.perspective = new Perspective();
    this.touchControls = new TouchControls(emitter, this.perspective);
    this.engine = new Engine(gl, this.props.width, this.props.height);

    // The react event system is too slow, so using the native events
    this.canvas.addEventListener('touchstart', emit(emitter, TOUCH_START), false)
    this.canvas.addEventListener('touchmove', emit(emitter, TOUCH_MOVE), false);
    this.canvas.addEventListener('touchend', emit(emitter, TOUCH_END), false);

    fromEmitter(emitter, (x, y) => this.perspective.viewportToTile(x, y), this.props.dispatch, this.engine);
    forestHandler(undefined, this.props.currentContext.forest, this.engine);

    this.shellConfig = startShell({
      tickInterval : this.props.tickInterval,
      render: (delta : number) => {
        if(this.ease){
          const box = this.ease.next(delta);
          if(!box.done){
            this.perspective.reset(arrayToBox(box.value));
          }else{
            this.ease = undefined;
          }
        }
        const changed = this.touchControls.panZoomSaga.process();
        if(changed){
          this.props.dispatch(panZoom(
            this.perspective.tileToViewport.bind(this.perspective),
            this.perspective.viewportToTileFloored.bind(this.perspective)
          ));
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
          this.perspective.viewportToTileFloored.bind(this.perspective)
        ));
      }
    });

    this.perspective.reset(this.props.currentContext.boundingBox);
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
        const from = scaleBox(nextContext.boundingBox, 0.7, previousContext.centerX, previousContext.centerY);
        this.perspective.reset(from);
        this.ease = ease(boxToArray(from), boxToArray(nextContext.boundingBox), easeOut, 200);
      }else if(nextProps.previousContext === undefined){
        this.perspective.reset(nextContext.boundingBox);
      }else if(nextProps.previousContext.name === currentContext.name){
        const from = scaleBox(nextContext.boundingBox, 1.4);
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
};

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
  const halfWidth = (right - left)/2;
  const halfHeight = (bottom - top)/2;
  const scaleX = halfHeight <= halfWidth ? scale : halfWidth/halfHeight*scale;
  const scaleY = halfHeight >= halfWidth ? scale : halfHeight/halfWidth*scale;
  return {
    top: y - halfHeight**scaleY,
    left: x - halfWidth**scaleX,
    right: x + halfWidth**scaleX,
    bottom: y + halfHeight**scaleY
  };
}