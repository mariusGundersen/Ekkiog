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

    const items = this.state.show ? [
      {center: 0.475, tool: 'wire'},
      {center: 0.625, tool: 'underpass'},
      {center: 0.775, tool: 'gate'}
    ] : [];

    return (
      <svg width={this.props.width} height={this.props.height} viewBox={`0 0 ${this.props.width} ${this.props.height}`}>
        <circle cx={cx} cy={cy} r={radius} fill="white" stroke="black" strokeWidth="2" onClick={this.toggleShow} />
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
      </svg>
    );
  }
}