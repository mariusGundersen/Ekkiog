import React from 'react';

import PieSector from './PieSector.jsx';

import IconWire from './IconWire.jsx';
import IconUnderpass from './IconUnderpass.jsx';
import IconButton from './IconButton.jsx';
import IconGate from './IconGate.jsx';
import IconReturn from './IconReturn.jsx';

export default ({
  screenWidth,
  screenHeight,
  showMenu,
  selectedTool,
  onClick,
  onToolSelected
}) => {
  const radius = 40;
  const gap = 10;
  const cx = screenWidth - radius - gap;
  const cy = screenHeight - radius - gap;

  const items = [
    {center: showMenu ? 0.475 : 1/8, tool: 'wire', icon: <IconWire />, onClick: () => onToolSelected('wire')},
    {center: showMenu ? 0.625 : 1/8, tool: 'button', icon: <IconButton />, onClick: () => onToolSelected('button')},
    {center: showMenu ? 0.775 : 1/8, tool: 'gate', icon: <IconGate />, onClick: () => onToolSelected('gate')}
  ];

  return (
    <g>
      <defs>
        <clipPath id="radialClipPath">
          <rect x="0" y="0" width={cx} height={screenHeight} fill="white" />
          <rect x="0" y="0" width={screenWidth} height={cy} fill="white" />
        </clipPath>
      </defs>

      <g transform={`translate(${cx}, ${cy})`} onClick={onClick}>
        <circle cx={0} cy={0} r={radius} fill="#2a2d30" stroke="#446364" strokeWidth="2" />

        {showMenu ? <IconReturn /> :
          selectedTool == 'wire' ? <IconWire /> :
          selectedTool == 'button' ? <IconButton /> :
          selectedTool == 'gate' ? <IconGate /> : ''}
      </g>

      <g clipPath="url(#radialClipPath)">
        {items.map(item => (
          <PieSector
            key={item.tool}
            cx={cx}
            cy={cy}
            innerRadius={radius+gap}
            outerRadius={100}
            turnFractionCenter={item.center}
            turnFractionSection={0.15}
            gap={5}
            selected={selectedTool == item.tool}
            onClick={item.onClick}>
              {item.icon}
            </PieSector>
        ))}
      </g>
    </g>
  );
}