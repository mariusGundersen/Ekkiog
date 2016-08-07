import React from 'react';

import Loading from './radialMenu/Loading.jsx';
import RadialMenu from './RadialMenu.jsx';

import IconWire from './icons/IconWire.jsx';
import IconUnderpass from './icons/IconUnderpass.jsx';
import IconButton from './icons/IconButton.jsx';
import IconGate from './icons/IconGate.jsx';
import IconReturn from './icons/IconReturn.jsx';

const selectedTool = '';

export default ({
  x,
  y,
  loading,
  show,
  radius,
  width
}) => (
  <g transform={`translate(${x} ${y})`}>
    {loading ? <Loading radius={radius} width={width+2} /> : ''}
    {show ? <RadialMenu
      cx={0}
      cy={0}
      showMenu={true}
      center={null}
      menuTree={[
        {
          radius: radius,
          width: width,
          fromTurnFraction: 3/8,
          toTurnFraction: 9/8,
          show: true,
          menuItems: [
            {
              tool: 'wire',
              selected: selectedTool === 'wire',
              onClick: () => dispatch(setSelectedTool('wire')),
              icon: <IconWire />
            },
            {
              tool: 'button',
              selected: selectedTool === 'button',
              onClick: () => dispatch(setSelectedTool('button')),
              icon: <IconButton />
            },
            {
              tool: 'gate',
              selected: selectedTool === 'gate',
              onClick: () => dispatch(setSelectedTool('gate')),
              icon: <IconGate />
            },
            {
              tool: 'underpass',
              selected: selectedTool === 'underpass',
              onClick: () => dispatch(setSelectedTool('underpass')),
              icon: <IconUnderpass />
            }
          ]
        }
      ]} /> : null}
  </g>
);