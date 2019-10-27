import * as React from 'react';
import { Transition } from 'react-transition-group';

export interface Props {
  readonly show: boolean
  component(): React.ReactNode
  readonly delay?: number
  readonly enterDelay?: number
  readonly exitDelay?: number
};

interface State {
  show: boolean
}

export default class DelayEnterExit extends React.Component<Props, State> {
  private timeout: any
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.show) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.setState({ show: true }), this.props.enterDelay || this.props.delay || 0);
    } else if (!this.props.show) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.setState({ show: false }), this.props.exitDelay || this.props.delay || 0);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.show && !prevProps.show) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.setState({ show: true }), this.props.enterDelay || this.props.delay || 0);
    } else if (!this.props.show && prevProps.show) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.setState({ show: false }), this.props.exitDelay || this.props.delay || 0);
    }
  }

  render() {
    if (this.state && this.state.show) {
      return this.props.component();
    } else {
      return null;
    }
  }
}
