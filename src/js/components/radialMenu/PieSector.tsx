import * as React from 'react';
import {mat4, vec2} from 'gl-matrix';

import style from '../main.css';

export interface Props {
  innerRadius : number;
  outerRadius : number;
  selected : boolean;
  turnFractionCenter : number;
  turnFractionSection : number;
  gap : number;
  itemKey : string;
  onClick() : void;
  icon : JSX.Element;
  visible : boolean;
}

export default ({
  innerRadius,
  outerRadius,
  selected,
  turnFractionCenter,
  turnFractionSection,
  gap,
  itemKey,
  onClick,
  icon,
  visible
} : Props) => {
  const averageRadius = (innerRadius + outerRadius)/2;

  const radiansStart = -turnFractionSection*Math.PI;
  const radiansEnd = turnFractionSection*Math.PI;
  const degreesRotate = turnFractionCenter*360;

  if(!visible){
    return (
      <g
        key={itemKey}
        className={`${style.clickable} ${style.transTrans}`}
        style={{transform: `rotate(${degreesRotate}deg)`}}>
      </g>);
  }

  const path = `
    M${innerRadius*Math.cos(radiansStart)-gap*Math.sin(radiansStart)},${innerRadius*Math.sin(radiansStart)+gap*Math.cos(radiansStart)}
    A${innerRadius},${innerRadius} 0 0,1 ${innerRadius*Math.cos(radiansEnd)+gap*Math.sin(radiansEnd)},${innerRadius*Math.sin(radiansEnd)-gap*Math.cos(radiansEnd)}
    L${outerRadius*Math.cos(radiansEnd)+gap*Math.sin(radiansEnd)},${outerRadius*Math.sin(radiansEnd)-gap*Math.cos(radiansEnd)}
    A${outerRadius},${outerRadius} 0 0,0 ${outerRadius*Math.cos(radiansStart)-gap*Math.sin(radiansStart)},${outerRadius*Math.sin(radiansStart)+gap*Math.cos(radiansStart)}
    z`;

  return (
    <g
      key={itemKey}
      onClick={onClick}
      className={`${style.clickable} ${style.transTrans}`}
      style={{transform: `rotate(${degreesRotate}deg)`}}>
      <path
        fill="#2a2d30"
        stroke="#446364"
        strokeWidth="2"
        d={path}/>
        <g transform={`translate(${averageRadius} 0)`}>
          <g className={style.transTrans} style={{transform: `rotate(${-degreesRotate}deg)`}} >
            {icon}
          </g>
        </g>
    </g>
  );
}