import * as React from 'react';
import reax from 'reaxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';

import theme from '../theme.scss';
import style from './selectRepo.scss';
import { startWith } from 'rxjs/operators';

const DEFAULT_REPO_NAME = 'ekkiog-workspace';

export interface Props {
  readonly user : OauthData
}

export default reax({
},
({}, props, initialProps : Props) => {

  const usage = fromPromise(getEstimate()).pipe(startWith({usage: 0}));

  return {
    usage
  };
},
({events, props, values}) => <>
  <div className={style.photoContainer}>
    <img className={style.photo} src={props.user.photo} />
    <h3>{props.user.name}</h3>
    <h5>{props.user.server}/{props.user.username}/{props.user.repo}</h5>
    <pre>
      Used {formatBytes(values.usage.usage)}
    </pre>
  </div>
</>);

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