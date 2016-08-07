import React from 'react';
import {mat4, vec2} from 'gl-matrix';

export default ({
  innerRadius,
  outerRadius,
  selected,
  turnFractionCenter,
  turnFractionSection,
  gap,
  tool,
  onClick,
  icon
}) => {
  const averageRadius = (innerRadius + outerRadius)/2;

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
      key={tool}
      onClick={onClick}
      className="trans-trans clickable"
      style={{transform: `rotate(${degreesRotate}deg)`}}>
      <path
        fill="#2a2d30"
        stroke="#446364"
        strokeWidth="2"
        d={path}/>
        <g transform={`translate(${averageRadius} 0)`}>
          <g className="trans-trans" style={{transform: `rotate(${-degreesRotate}deg)`}} >
            {icon}
          </g>
        </g>
    </g>
  );
}