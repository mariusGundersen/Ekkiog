import * as React from 'react';
import reax from 'reaxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, startWith } from 'rxjs/operators';

import { getOwnedComponents } from '../../storage';
import style from './mainMenu.scss';

export default reax({}, ({}, props, initialProps : {}) => {

  const usage = fromPromise(getEstimate()).pipe(
    startWith({usage: 0})
  );
  const count = fromPromise(getOwnedComponents()).pipe(
    map(d => d.length),
    startWith(0)
  );

  return {
    usage,
    count
  };
},
({events, props, values}) => (
  <div className={style.statistics}>
    <strong>{values.count}</strong> components, <strong>{formatBytes(values.usage.usage)}</strong>
  </div>
));

async function getEstimate() : Promise<{quota : number, usage : number}>{
  return await (navigator as any).storage.estimate();
}

function formatBytes(bytes : number){
  if(bytes < 1024){
    return `${bytes} bytes`;
  }else if(bytes < 1024*1024){
    return `${(bytes/1024).toFixed(2)} KiB`;
  }else if(bytes < 1024*1024*1024){
    return `${(bytes/1024/1024).toFixed(2)} MiB`;
  }else{
    return `${(bytes/1024/1024/1024).toFixed(2)} GiB`;
  }
}