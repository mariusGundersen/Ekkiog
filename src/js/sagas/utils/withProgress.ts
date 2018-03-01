import Terminal from '@es-git/terminal';
import { put, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import {gitProgressMessage } from '../../actions';

type StringOrResult = string | {name : string}[];

export default function* withProgress(terminal : Terminal, start : (emit : (v : any) => void) => Promise<any>){
  const channel = yield eventChannel(emit => {
    start(emit).then(emit, emit);
    return () => {};
  });

  while(true){
    const message : StringOrResult = yield take(channel);
    if(typeof(message) === 'string'){
      yield put(gitProgressMessage(terminal.log(message)));
    }else{
      return message;
    }
  }
}