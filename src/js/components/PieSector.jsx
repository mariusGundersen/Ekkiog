import React from 'react';
import {mat4, vec2} from 'gl-matrix';

export default props => {
  const cx = props.cx;
  const cy = props.cy;
  const innerRadius = props.innerRadius;
  const outerRadius = props.outerRadius + (props.selected ? 10 : 0);
  const averageRadius = (innerRadius + outerRadius)/2;
  const turnFractionCenter = props.turnFractionCenter;
  const turnFractionSection = props.turnFractionSection;
  const gap = props.gap * (props.selected ? 0 : 1);

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
    <g
      onClick={props.onClick}
      style={{transform: `translate(${cx}px, ${cy}px) rotate(${degreesRotate}deg)`}}>
      <path
        fill="#555555"
        stroke="black"
        strokeWidth="2"
        d={path}/>
        <g transform={`translate(${averageRadius}, 0) rotate(${-degreesRotate})`} >
          {props.children}
        </g>
    </g>
  );
}