import Terminal from '@es-git/terminal';
import { put, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { gitProgressMessage } from '../../actions';

type StringOrResult = string | { name: string }[];

export default function* withProgress<T>(terminal: Terminal, start: (emit: (v: string) => void) => Promise<T>) {
  const channel = yield eventChannel(emit => {
    start(throttle(200, emit)).then(emit, emit);
    return () => { };
  });

  while (true) {
    const message: StringOrResult = yield take(channel);
    if (typeof (message) === 'string') {
      yield put(gitProgressMessage(terminal.log(message)));
    } else {
      return message;
    }
  }
}

function throttle<T>(time: number, func: (value: T) => void): (value: T) => void {
  let previous = window.performance.now();
  return (value: T) => {
    const now = window.performance.now();
    if (now - previous > time) {
      previous = now;
      func(value);
    }
  }
}
