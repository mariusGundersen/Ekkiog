import * as React from 'react';
import IconPause from 'react-icons/fa/pause';
import IconRewind from 'react-icons/fa/fast-backward';
import IconLoop from 'react-icons/fa/retweet';
import IconStepForward from 'react-icons/fa/step-forward';
import IconPlay from 'react-icons/fa/play';
import IconFast from 'react-icons/fa/forward';
import IconShare from 'react-icons/fa/paper-plane';

import pure from './pure';

import style from './simulationMenu.scss';
import { lookup } from 'dns';

export interface Props {
  readonly show: boolean
  readonly testScenario: boolean
  readonly tickInterval: number
  readonly looping: boolean
  readonly canShare: boolean
  setTickInterval(tickInterval: number): void
  stepForward(e: any): void
  rewind(e: any): void
  share(e: any): void
  loop(e: any): void
}

export default pure(['show', 'tickInterval', 'looping'],
  (props: Props) => (
    <div className={style.container}>
      <div className={style.simulationMenu} data-show={props.show}>
        <div className={style.testResults} data-show={props.testScenario}></div>
        <div className={style.menuBar}>
          <div className={style.flexFill} />
          {props.canShare && <button onClick={props.share}>
            <IconShare />
          </button>}

          <div className={style.divider} />

          <TestScenarioButtons {...props} />

          {props.tickInterval === Infinity
            ? <button onClick={props.stepForward}>
              <IconStepForward />
            </button>
            : <button onClick={() => props.setTickInterval(Infinity)}>
              <IconPause />
            </button>
          }

          <button onClick={() => props.setTickInterval(2 ** 8)} className={props.tickInterval == 2 ** 8 ? style.selected : ''}>
            <IconPlay />
          </button>

          <button onClick={() => props.setTickInterval(2 ** 1)} className={props.tickInterval == 2 ** 1 ? style.selected : ''}>
            <IconFast />
          </button>
        </div>
      </div>
    </div>
  ));

function TestScenarioButtons(props: Props) {
  if (!props.testScenario) return null;

  return (
    <>
      <button onClick={props.loop} className={props.looping ? style.selected : ''}>
        <IconLoop />
      </button>
      <button onClick={props.rewind}>
        <IconRewind />
      </button>
    </>
  );
}
