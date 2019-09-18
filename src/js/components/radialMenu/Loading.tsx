import * as React from 'react';
import createRef, { Ref } from '../createRef';

export interface Props {
  radius: number;
  width: number;
}

export default class Loading extends React.Component<Props, any> {
  private circumference: number;
  private circle = createRef<SVGCircleElement>();
  constructor(props: Props) {
    super(props);
    this.circumference = Math.PI * 2 * (props.radius + props.width / 2);
  }
  componentDidMount() {
    if (this.circle.current) {
      this.circle.current.getBoundingClientRect();
      this.circle.current.style.strokeDasharray = `${this.circumference / 2} 0`;
    }
  }
  componentDidUpdate() {
    if (this.circle.current) {
      this.circle.current.getBoundingClientRect();
      this.circle.current.style.strokeDasharray = `${this.circumference / 2} 0`;
    }
  }
  render() {
    return <circle
      transform="rotate(90)"
      ref={this.circle}
      style={{
        transition: 'stroke-dasharray 0.75s',
        strokeDashoffset: '0',
        strokeDasharray: `0 ${this.circumference}`,
        stroke: '#424C57',
        fill: 'none'
      }}
      cx={0}
      cy={0}
      r={this.props.radius + this.props.width / 2}
      strokeWidth={this.props.width} />;
  }
}
