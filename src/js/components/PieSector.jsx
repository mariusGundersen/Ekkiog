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

    const radiansStart = (turnFractionCenter*2 - turnFractionSection)*Math.PI;
    const radiansEnd = (turnFractionCenter*2 + turnFractionSection)*Math.PI;

    const path = [
      `M${cx+innerRadius*Math.cos(radiansStart)-gap*Math.sin(radiansStart)},${cy+innerRadius*Math.sin(radiansStart)+gap*Math.cos(radiansStart)}`,
      `A${innerRadius},${innerRadius} 0 0,1 ${cx+innerRadius*Math.cos(radiansEnd)+gap*Math.sin(radiansEnd)},${cy+innerRadius*Math.sin(radiansEnd)-gap*Math.cos(radiansEnd)}`,
      `L${cx+outerRadius*Math.cos(radiansEnd)+gap*Math.sin(radiansEnd)},${cy+outerRadius*Math.sin(radiansEnd)-gap*Math.cos(radiansEnd)}`,
      `A${outerRadius},${outerRadius} 0 0,0 ${cx+outerRadius*Math.cos(radiansStart)-gap*Math.sin(radiansStart)},${cy+outerRadius*Math.sin(radiansStart)+gap*Math.cos(radiansStart)}`,
      'z'
    ].join(' ');

    return (
      <path fill="white" stroke="black" strokeWidth="2" d={path} onClick={this.props.onClick} />
    );
  }
}