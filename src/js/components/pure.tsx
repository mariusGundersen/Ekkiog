import * as React from 'react';

export default function pure<TProps>(shouldComponentUpdate : (prevProps : TProps, nextProps : TProps) => boolean, component : (props : TProps) => JSX.Element){
  return class extends React.Component<TProps, any> {
    shouldComponentUpdate(nextProps : TProps){
      return shouldComponentUpdate(this.props, nextProps);
    }
    render(){
      return component(this.props);
    }
  }
}