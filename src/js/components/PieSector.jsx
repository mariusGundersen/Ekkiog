import React from 'react';

export default class PieSector extends React.Component {
  render () {
    const cx = this.props.cx;
    const cy = this.props.cy;
    const innerRadius = this.props.innerRadius;
    const outerRadius = this.props.outerRadius + (this.props.selected ? 10 : 0);
    const turnFractionCenter = this.props.turnFractionCenter;
    const turnFractionSection = this.props.turnFractionSection;
    const gap = this.props.gap * (this.props.selected ? 0 : 1);

    const radiansStart = -turnFractionSection*Math.PI;
    const radiansEnd = turnFractionSection*Math.PI;
    const degreesRotate = turnFractionCenter*360;

    const path = [
      `M${innerRadius*Math.cos(radiansStart)-gap*Math.sin(radiansStart)},${innerRadius*Math.sin(radiansStart)+gap*Math.cos(radiansStart)}`,
      `A${innerRadius},${innerRadius} 0 0,1 ${innerRadius*Math.cos(radiansEnd)+gap*Math.sin(radiansEnd)},${innerRadius*Math.sin(radiansEnd)-gap*Math.cos(radiansEnd)}`,
      `L${outerRadius*Math.cos(radiansEnd)+gap*Math.sin(radiansEnd)},${outerRadius*Math.sin(radiansEnd)-gap*Math.cos(radiansEnd)}`,
      `A${outerRadius},${outerRadius} 0 0,0 ${outerRadius*Math.cos(radiansStart)-gap*Math.sin(radiansStart)},${outerRadius*Math.sin(radiansStart)+gap*Math.cos(radiansStart)}`,
      'z'
    ].join(' ');

    return (
      <path
        style={{transform: `translate(${cx}px, ${cy}px) rotate(${degreesRotate}deg)`}}
        fill="#555555"
        stroke="black"
        strokeWidth="2"
        d={path}
        onClick={this.props.onClick} />
    );
  }
}