import React from 'react';
import Rx from 'rxjs/Rx.js';

export default function connect(actions, observablesFactory, Component){
  return class extends React.Component{
    constructor(props){
      super(props);
      const observableProps = new Rx.Observable(s => this.componentWillReceiveProps = nextProps => s.next(nextProps))
        .startWith(props);

      const {functions, sources} = deconstruct(actions);
      const observables = observablesFactory(sources, observableProps);

      this.functions = functions;
      this.subscriptions = Rx.Observable.merge(
        ...Object.keys(observables).map(x => observables[x]),
        ...Object.keys(sources).map(x => sources[x]),
        observableProps
      ).subscribe();

      var state = {};
      for(let key of Object.keys(observables)){
        observables[key].forEach(value => {
          if(this.state){
            this.setState({[key]: value});
          }else{
            state[key] = value;
          }
        });
      }
      this.state = state;
    }

    cmponentDidUnmount(){
      this.subscriptions.unsubscribe();
    }

    render(){
      return <Component actions={this.functions} {...this.props} {...this.state} />;
    }
  }
}

function deconstruct(actions){
  const functions = Object.create(null);
  const sources = Object.create(null);
  for(let key of Object.keys(actions)){
    if(typeof actions[key] !== 'function') throw new Error(`action ${key} must be a function`);

    sources[key] = new Rx.Observable(s => {
      functions[key] = v => s.next(actions[key](v))
    });
  }

  return {
    functions,
    sources
  };
}