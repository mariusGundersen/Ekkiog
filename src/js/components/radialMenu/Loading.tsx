import * as React from 'react';

export interface Props {
  radius : number;
  width : number;
}

export default class Loading extends React.Component<Props, any> {
  circumference : number;
  circle? : SVGCircleElement;
  constructor(props : Props){
    super(props);
    this.circumference = Math.PI*2*(props.radius+props.width/2);
  }
  componentDidMount(){
    if(this.circle){
      this.circle.getBoundingClientRect();
      this.circle.style.strokeDasharray = `${this.circumference/2} 0`;
    }
  }
  componentDidUpdate(){
    if(this.circle){
      this.circle.getBoundingClientRect();
      this.circle.style.strokeDasharray = `${this.circumference/2} 0`;
    }
  }
  render(){
    return <circle
      transform="rotate(90)"
      ref={c => this.circle = c}
      style={{
        transition: 'stroke-dasharray 0.9s',
        strokeDashoffset: '0',
        strokeDasharray: `0 ${this.circumference}`,
        stroke: '#446364',
        fill: 'none'
      }}
      cx={0}
      cy={0}
      r={this.props.radius + this.props.width/2}
      strokeWidth={this.props.width} />;
  }
}
