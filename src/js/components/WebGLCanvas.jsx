import React from 'react';
import {connect} from 'react-redux';

import style from './main.css';

import {
  GL
} from '../actions';

import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END
} from '../events';

const WebGLCanvas = connect(
  ({view}) => ({
    width: view.pixelWidth,
    height: view.pixelHeight
  })
)(class extends React.Component{
  componentDidMount(){
    const gl = getContext(this.canvas);

    // The react event system is too slow, so using the native events
    this.canvas.addEventListener('touchstart', dispatchTouchEvents(this.props.dispatch, TOUCH_START), false)
    this.canvas.addEventListener('touchmove', dispatchTouchEvents(this.props.dispatch, TOUCH_MOVE), false);
    this.canvas.addEventListener('touchend', dispatchTouchEvents(this.props.dispatch, TOUCH_END), false);

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
        className={style.canvas}
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

function dispatchTouchEvents(dispatch, type){
  return event => {
    for(let i=0; i < event.changedTouches.length; i++){
      let touch = event.changedTouches[i];
      dispatch({
        type,
        id: touch.identifier,
        x: touch.pageX*window.devicePixelRatio,
        y: touch.pageY*window.devicePixelRatio,
        meta: {
          emit: true
        }
      });
    }

    event.preventDefault();
  }
}