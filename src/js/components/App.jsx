import React from 'react';

import PieSector from './PieSector.jsx';

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
      {center: this.state.show ? 0.475 : 1/8, tool: 'wire'},
      {center: this.state.show ? 0.625 : 1/8, tool: 'underpass'},
      {center: this.state.show ? 0.775 : 1/8, tool: 'gate'}
    ];

    return (
      <svg width={this.props.width} height={this.props.height} viewBox={`0 0 ${this.props.width} ${this.props.height}`}>

        <defs>
          <clipPath id="radialClipPath">
            <rect x="0" y="0" width={cx} height={this.props.height} fill="white" />
            <rect x="0" y="0" width={this.props.width} height={cy} fill="white" />
          </clipPath>
        </defs>

        <circle cx={cx} cy={cy} r={radius} fill="white" stroke="black" strokeWidth="2" onClick={this.toggleShow} />
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
              onClick={() => this.setTool(item.tool)} />
          ))}
        </g>
      </svg>
    );
  }
}