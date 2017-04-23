import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Forest, TreeNode, Box } from 'ekkiog-editing';
import { EventEmitter } from 'events';
import { getIterator } from 'ennea-tree';

import style from './main.css';

import {
  resize,
  panZoom,
  setForest,
  simulationTick
} from '../actions';
import { State } from '../reduce';
import { SelectionState } from '../reducers/selection';
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

export interface Props{
  dispatch : Dispatch<State>,
  tickInterval : number,
  width : number,
  height : number,
  forest : Forest,
  selection : SelectionState,
  contextMenu : ContextMenuState,
  name : string
}

const WebGLCanvas = connect(
  ({view, forest, selection, contextMenu, editor, simulation} : State) => ({
    forest,
    selection,
    width: view.pixelWidth,
    height: view.pixelHeight,
    contextMenu,
    name: editor.currentComponentName,
    tickInterval: simulation.tickInterval
  })
)(class WebGLCanvas extends React.Component<Props, void> {
  private canvas : HTMLCanvasElement;
  private engine : Engine;
  private perspective : Perspective;
  private touchControls : TouchControls;
  private shellConfig : Config
  componentDidMount(){
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

    fromEmitter(emitter, (x, y) => this.perspective.viewportToTile(x, y), this.props.dispatch);

    this.shellConfig = startShell({
      tickInterval : this.props.tickInterval,
      render: () => {
        const changed = this.touchControls.panZoomSaga.process();
        if(changed){
          this.props.dispatch(panZoom(this.perspective.tileToViewport.bind(this.perspective), this.perspective.viewportToTileFloored.bind(this.perspective)));
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
        const prevWidth = this.perspective.viewportWidth;
        const mapPosA = this.perspective.viewportToMap(0, 0);
        const mapPosB = this.perspective.viewportToMap(prevWidth, 0);
        this.perspective.setViewport(pixelWidth, pixelHeight);
        const squarePosA = this.perspective.viewportToSquare(0, 0);
        const squarePosB = this.perspective.viewportToSquare(pixelWidth, 0);

        this.perspective.transformMapToSquare(
          [mapPosA, squarePosA],
          [mapPosB, squarePosB]);

        this.props.dispatch(panZoom(this.perspective.tileToViewport.bind(this.perspective), this.perspective.viewportToTileFloored.bind(this.perspective)));
      }
    });
  }

  componentWillReceiveProps(nextProps : Props){
    this.shellConfig.setTickInterval(nextProps.tickInterval);
    forestHandler(this.props.forest, nextProps.forest, this.engine);
    moveHandler(this.props.selection, nextProps.selection, this.engine);
    if(nextProps.selection.selection && !this.props.selection.selection){
      this.touchControls.selectionSaga.startSelection(nextProps.selection);
      this.touchControls.pointerSaga.disableAll();
    }else if(this.props.selection.selection && !nextProps.selection.selection){
      this.touchControls.selectionSaga.stopSelection();
      this.touchControls.pointerSaga.enableAll();
    }

    if(nextProps.contextMenu.show && !this.props.contextMenu.show){
      this.touchControls.pointerSaga.disableAll();
    }else if(this.props.contextMenu.show && !nextProps.contextMenu.show){
      this.touchControls.pointerSaga.enableAll();
    }

    if(nextProps.name !== this.props.name){
      this.perspective.reset(calculateBoundingBox(nextProps.forest.enneaTree));}
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
function calculateBoundingBox(tree : TreeNode) : Box {
  const box = {
    top: tree.size,
    left: tree.size,
    right: 0,
    bottom: 0
  };

  for(const node of getIterator(tree, {top: 0, left: 0, width: tree.size, height: tree.size})){
    box.top = Math.min(box.top, node.top-2);
    box.left = Math.min(box.left, node.left-2);
    box.right = Math.max(box.right, node.left+node.width+2);
    box.bottom = Math.max(box.bottom, node.top+node.height+2);
  }

  if(box.top > box.bottom){
    return {
      top: 56,
      left: 56,
      right: 72,
      bottom: 72
    }
  }

  return box;
}