import React from 'react';
import {connect} from 'react-redux';

import {
  GL
} from '../actions.js';

import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END
} from '../events.js';

const WebGLCanvas = connect(
  ({view, global}) => ({
    width: view.pixelWidth,
    height: view.pixelHeight,
    emitter: global.emitter
  })
)(class extends React.Component{
  componentDidMount(){
    const gl = getContext(this.canvas);

    // The react event system is too slow, so using the native events
    this.canvas.addEventListener('touchstart', emitTouchEvents(this.props.emitter, TOUCH_START), false)
    this.canvas.addEventListener('touchmove', emitTouchEvents(this.props.emitter, TOUCH_MOVE), false);
    this.canvas.addEventListener('touchend', emitTouchEvents(this.props.emitter, TOUCH_END), false);

    this.props.dispatch({
      type: GL,
      gl
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.width != this.props.width
        || nextProps.height != this.props.height;
  }

  render(){
    return (
      <canvas
        ref={c => this.canvas = c}
        width={this.props.width}
        height={this.props.height} />
    );
  }
});

export default WebGLCanvas;

function getContext(canvas) {
  return canvas.getContext("webgl", {})
      || canvas.getContext("experimental-webgl", {});
}

function emitTouchEvents(emitter, type){
  return event => {
    for(let i=0; i < event.changedTouches.length; i++){
      let touch = event.changedTouches[i];
      emitter.emit(type, {
        id: touch.identifier,
        x: touch.pageX*window.devicePixelRatio,
        y: touch.pageY*window.devicePixelRatio
      });
    }

    event.preventDefault();
  }
}