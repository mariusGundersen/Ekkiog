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
        onTouchStart={emitTouchEvents(this.props.emitter, 'touchStart')}
        onTouchMove={emitTouchEvents(this.props.emitter, 'touchMove')}
        onTouchEnd={emitTouchEvents(this.props.emitter, 'touchEnd')}
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