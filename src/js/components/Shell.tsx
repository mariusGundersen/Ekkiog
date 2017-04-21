import * as React from 'react';

export interface Props {
  tickInterval : number;
  render() : void;
  tick(tickCount : number) : void;
  resize(pixelWidth : number, pixelHeight : number) : void;
}

export default class Shell extends React.Component<Props, void> {
  tickCount : number;
  frameRequest : number;
  tickTimout : NodeJS.Timer;
  cancelOnResize : () => void;
  constructor(props : Props){
    super(props);
    this.tickCount = 0;
  }

  onFrameRequest() {
    this.frameRequest = window.requestAnimationFrame(this.onFrameRequest);
    this.props.render();
  }

  onTickRequest() {
    this.tickTimout = setTimeout(() => this.onTickRequest(), this.props.tickInterval);
    this.props.tick(this.tickCount++);
  }

  onResizeRequest() {
    const screenWidth = window.document.body.clientWidth;
    const screenHeight = window.document.body.clientHeight;
    const pixelWidth = screenWidth*window.devicePixelRatio;
    const pixelHeight = screenHeight*window.devicePixelRatio;
    this.props.resize(pixelWidth, pixelHeight);
  };

  componentDidMount(){
    this.frameRequest = window.requestAnimationFrame(this.onFrameRequest);

    this.tickTimout = setTimeout(() => this.onTickRequest(), this.props.tickInterval);
    this.cancelOnResize = onResize(() => this.onResizeRequest());
  }

  componentWillUnmount(){
    window.cancelAnimationFrame(this.frameRequest);
    clearTimeout(this.tickTimout);
    this.cancelOnResize();
  }

  render(){
    return null;
  }
}

function onResize(handler : () => void){
  window.addEventListener('resize', handler);
  handler();
  return () => {
    window.removeEventListener('resize', handler);
  }
}