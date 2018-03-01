import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reduce/index';
import { startSync, toggleUpload, toggleDownload } from './actions';
import { SyncState, SyncItem } from './reduce';
import { Dispatch } from 'redux';

import SyncIcon from 'react-icons/fa/refresh';
import BusyIcon from 'react-icons/fa/spinner';
import OkIcon from 'react-icons/fa/check';
import PullIcon from 'react-icons/fa/cloud-download';
import PushIcon from 'react-icons/fa/cloud-upload';
import ChevronIcon from 'react-icons/fa/angle-right';
import CheckIcon from 'react-icons/fa/toggle-on';
import UnCheckIcon from 'react-icons/fa/toggle-off';

import theme from '../../components/theme.scss';
import style from './style.scss';
import reax from 'reaxjs';
import { scan, switchMap, map } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { syncGo, hidePopup } from '../../actions/index';

type Props = SyncState & {dispatch: Dispatch<State>};

export default connect((state : State) => state.sync)((props : Props) => {
  return <div className={style.popup+' '+theme.itemList}>
    {props.isUpToDate ?
      <>
        <div className={theme.item}>
            <span className={theme.label+' '+style.header}>Nothing to synchronize</span>
        </div>
        <div className={theme.item} >
          <button className={theme.nestedButton} onClick={() => props.dispatch(hidePopup())}>
            <span className={theme.icon}><OkIcon /></span>
            <span className={theme.label}>Ok</span>
          </button>
        </div>
      </> : <>
        <div className={theme.item}>
            <span className={theme.label+' '+style.header}>Synchronize</span>
        </div>
        <DropdownList key='push' title='Upload' list={props.diverged.concat(props.infront)} action='push' onItemClick={(...name) => props.dispatch(toggleUpload(name))}/>
        <DropdownList key='pull' title='Download' list={props.diverged.concat(props.behind)} action='pull' onItemClick={(...name) => props.dispatch(toggleDownload(name))}/>
        <div className={theme.item} >
          <button className={theme.nestedButton} onClick={() => props.dispatch(syncGo())}>
            <span className={theme.icon}><OkIcon /></span>
            <span className={theme.label}>Go!</span>
          </button>
        </div>
      </>
    }
  </div>;
});

interface DropdownProps {
  readonly title : string
  readonly list : SyncItem[]
  readonly action : string
  onItemClick(...name : string[]) : void
}

const DropdownList = reax({
  toggle: (e : any) => true,
  toggleAll: (e : any) => true
},
(events, props, initialProps : DropdownProps) => {
  events.toggleAll.pipe(
    withLatestFrom(props),
    map(([e, p]) => p)
  ).subscribe(p => p.onItemClick(...p.list.map(i => i.name)))

  return {
    open: events.toggle.pipe(scan(acc => !acc, false))
  }
},
({props, events, values}) => {
  if(props.list.length === 0) return null;
  return <>
    <div key={props.action} className={theme.item} onClick={events.toggle}>
      <span className={values.open ? theme.iconDown : theme.icon}><ChevronIcon /></span>
      <span className={theme.label}>{props.title} ({props.list.filter(x => x.action === props.action).length} of {props.list.length})</span>
      <span className={theme.icon} onClick={events.toggleAll}>{props.action === 'pull' ? <PullIcon /> : <PushIcon />}</span>
    </div>
    {values.open && props.list.map(({name, action}) => (
      <div key={name} className={theme.subItem} onClick={() => props.onItemClick(name)}>
        <span className={theme.label}>{name}</span>
        <span className={theme.icon}>{action === props.action ? <CheckIcon /> : <UnCheckIcon />}</span>
      </div>
    ))}
  </>;
});

function classnames(...names : string[]){
  return names.join(' ');
}