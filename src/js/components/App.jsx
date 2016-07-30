import React from 'react';

export default class App extends React.Component {
  render () {
    return (
      <svg width={this.props.width} height={this.props.height} viewBox={`0 0 ${this.props.width} ${this.props.height}`}>

        <circle cx={this.props.width - 50} cy={this.props.height - 50} r={30} fill="white" stroke="black" />
      </svg>
    );
  }
}