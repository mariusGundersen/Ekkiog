import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reduce/index';
import { startSync } from './actions';
import { SyncState, ComponentStatus } from './reduce';
import { Dispatch } from 'redux';

import SyncIcon from 'react-icons/fa/refresh';
import BusyIcon from 'react-icons/fa/spinner';
import OkIcon from 'react-icons/fa/check';
import PullIcon from 'react-icons/fa/cloud-download';
import PushIcon from 'react-icons/fa/cloud-upload';

import theme from '../../components/theme.scss';
import style from './style.scss';
import { SyncStatus } from '../../actions/index';

export default connect((state : State) => state.sync)((state : SyncState & {dispatch: Dispatch<State>}) => {
  if(state.loading){
    return (
      <div className={style.flexer+' '+style.progress}>
        <div className={theme.spinningIcon}><BusyIcon /></div>
        <pre>{state.progress}</pre>
      </div>
    );
  }else{
    return <>
      <button className={theme.item} onClick={() => state.dispatch(startSync())}>
        <span className={theme.icon}><SyncIcon /></span>
        <span className={theme.label}>Sync</span>
      </button>
      {state.components.map(c => (
        <div key={c.name} className={theme.item}>
          <span className={theme.label}>{c.name}</span>
          <Icon {...c} />
        </div>
      ))}
      <div className={style.flexer} />
    </>;
  }
});

function Icon(props : ComponentStatus){
  if(props.name === 'TEST') console.log(props.name, props.status);
  switch(props.status){
    case 'loading':
      return <span className={theme.spinningIcon}><BusyIcon /></span>;
    case 'ok':
      return <span className={theme.icon}><OkIcon /></span>;
    case 'pull':
      return <span className={theme.icon}><PullIcon /></span>;
    case 'push':
      return <span className={theme.icon}><PushIcon /></span>;
    default:
      return <span className={theme.icon}>?</span>;
  }
}