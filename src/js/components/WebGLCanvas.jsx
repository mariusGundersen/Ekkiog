import React from 'react';
import {connect} from 'react-redux';

import{
  GL
} from '../actions.js';

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
    this.canvas.addEventListener('touchstart', emitTouchEvents(this.props.emitter, 'touchStart'), false)
    this.canvas.addEventListener('touchmove', emitTouchEvents(this.props.emitter, 'touchMove'), false);
    this.canvas.addEventListener('touchend', emitTouchEvents(this.props.emitter, 'touchEnd'), false);

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
    for(let touch of Array.from(event.changedTouches)){
      emitter.emit(type, {
        id: touch.identifier,
        x: touch.pageX*window.devicePixelRatio,
        y: touch.pageY*window.devicePixelRatio
      });
    }

    event.preventDefault();
  }
}