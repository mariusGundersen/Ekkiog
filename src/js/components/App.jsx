import React from 'react';

import PieSector from './PieSector.jsx';

import IconWire from './IconWire.jsx';
import IconUnderpass from './IconUnderpass.jsx';
import IconGate from './IconGate.jsx';
import IconReturn from './IconReturn.jsx';

export default class App extends React.Component {
  state = {
    show: false,
    selectedTool: 'wire'
  }

  toggleShow = () => {
    this.setState({show: !this.state.show});
  }

  setTool = tool => {
    this.props.setTool(tool);
    this.setState({selectedTool: tool});
  }

  render () {
    const radius = 40;
    const gap = 10;
    const cx = this.props.width - radius - gap;
    const cy = this.props.height - radius - gap;

    const items = [
      {center: this.state.show ? 0.475 : 1/8, tool: 'wire', icon: <IconWire />},
      {center: this.state.show ? 0.625 : 1/8, tool: 'underpass', icon: <IconUnderpass />},
      {center: this.state.show ? 0.775 : 1/8, tool: 'gate', icon: <IconGate />}
    ];

    return (
      <svg width={this.props.width} height={this.props.height} viewBox={`0 0 ${this.props.width} ${this.props.height}`}>

        <defs>
          <clipPath id="radialClipPath">
            <rect x="0" y="0" width={cx} height={this.props.height} fill="white" />
            <rect x="0" y="0" width={this.props.width} height={cy} fill="white" />
          </clipPath>
        </defs>

        <g transform={`translate(${cx}, ${cy})`} onClick={this.toggleShow}>
          <circle cx={0} cy={0} r={radius} fill="#555555" stroke="black" strokeWidth="2" />

          {this.state.show ? <IconReturn /> :
            this.state.selectedTool == 'wire' ? <IconWire /> :
            this.state.selectedTool == 'underpass' ? <IconUnderpass /> :
            this.state.selectedTool == 'gate' ? <IconGate /> : ''}
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
              gap={2}
              selected={this.state.selectedTool == item.tool}
              onClick={() => this.setTool(item.tool)}>
                {item.icon}
              </PieSector>
          ))}
        </g>
      </svg>
    );
  }
}