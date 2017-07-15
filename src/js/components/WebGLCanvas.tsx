import * as React from 'react';
import { connect } from 'react-redux';
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
import { HistoryEntry } from '../reducers/editor';
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
  readonly dispatch : Dispatch<State>,
  readonly tickInterval : number,
  readonly width : number,
  readonly height : number,
  readonly forest : Forest,
  readonly selection : SelectionState,
  readonly contextMenu : ContextMenuState,
  readonly name : string,
  readonly boundingBox : Box
  readonly previous : HistoryEntry
}

const WebGLCanvas = connect(
  ({view, forest, selection, contextMenu, editor, simulation} : State) => ({
    forest,
    selection,
    width: view.pixelWidth,
    height: view.pixelHeight,
    contextMenu,
    name: editor.currentComponentName,
    boundingBox: editor.boundingBox,
    previous: editor.history ? editor.history.value : undefined,
    tickInterval: simulation.tickInterval
  })
)(class WebGLCanvas extends React.Component<Props, any> {
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
    this.shellConfig.setTickInterval(nextProps.tickInterval);

    forestHandler(this.props.forest, nextProps.forest, this.engine);
    moveHandler(this.props.selection, nextProps.selection, this.engine);

    if(nextProps.selection.selection){
      if(!this.props.selection.selection
      || nextProps.selection.forest !== this.props.selection.forest){
        this.touchControls.selectionSaga.startSelection(nextProps.selection);
        this.touchControls.pointerSaga.disable();
      }
    }

    if(!nextProps.selection.selection){
      if(this.props.selection.selection){
        this.touchControls.selectionSaga.stopSelection();
        this.touchControls.pointerSaga.enable();
      }
    }

    if(nextProps.contextMenu.show !== this.props.contextMenu.show){
      if(nextProps.contextMenu.show){
        this.touchControls.pointerSaga.disable();
      }else{
        this.touchControls.pointerSaga.enable();
      }
    }

    if(nextProps.boundingBox !== this.props.boundingBox){
      if(this.props.previous && this.props.previous.name === nextProps.name){
        const from = scaleBox(nextProps.boundingBox, 0.5, this.props.previous.centerX, this.props.previous.centerY);
        this.perspective.reset(from);
        this.ease = ease(boxToArray(from), boxToArray(nextProps.boundingBox), easeOut, 200);
      }else if(nextProps.previous === undefined){
        this.perspective.reset(nextProps.boundingBox);
      }else if(nextProps.previous.name === this.props.name){
        const from = scaleBox(nextProps.boundingBox, 1.5);
        this.perspective.reset(from);
        this.ease = ease(boxToArray(from), boxToArray(nextProps.boundingBox), easeOut, 200);
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