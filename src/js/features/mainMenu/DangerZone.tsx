import * as React from 'react';
import DangerIcon from 'react-icons/fa/exclamation-triangle';
import SafeIcon from 'react-icons/fa/life-bouy';
import LogoutIcon from 'react-icons/fa/sign-out';
import BusyIcon from 'react-icons/fa/spinner';
import DeleteIcon from 'react-icons/fa/trash';
import ChevronIcon from 'react-icons/fa/angle-right';
import reax from 'reaxjs';
import { scan, startWith } from 'rxjs/operators';

import theme from '../../components/theme.scss';
import { deleteAllData, setUser } from '../../storage';
import style from './mainMenu.scss';

export default reax({
  toggle: (x : any) => true,
  deleteAll: (x : any) => true,
},
({
  toggle,
  deleteAll
}, props, initialProps : {loggedIn? : boolean}) => {

  deleteAll.subscribe(async () => {
    await deleteAllData();
    document.location.reload(true);
  });

  const isDeleting = deleteAll.pipe(
    startWith(false)
  );

  return {
    isDeleting,
    show: toggle.pipe(scan((state, action) => !state, false))
  }
},
({events, values, props}) => <>
  <button className={theme.item} key="toggle" onClick={events.toggle} data-active={values.show}>
    <span className={values.show ? theme.iconDown : theme.icon}>{<ChevronIcon />}</span>
    <span className={theme.label}>Danger-zone</span>
  </button>
  {values.show && props.loggedIn && <LogoutButton />}
  {values.show && <DeleteButton onClick={events.deleteAll} isBusy={values.isDeleting} />}
</>);

const LogoutButton = () => (
  <button className={theme.subItem+' '+style.dangerButton} onClick={() => {setUser(null as any); document.location.reload()}}>
    <span className={theme.icon}><LogoutIcon /></span>
    <span className={theme.label}>Logout from GitHub</span>
  </button>
);

const DeleteButton = (props : {onClick(x : any) : void, isBusy : boolean}) => (
  <button className={theme.subItem+' '+style.dangerButton} onClick={props.onClick}>
    <span className={props.isBusy ? theme.spinningIcon : theme.icon}>
      {props.isBusy
        ? <BusyIcon />
        : <DeleteIcon />}
    </span>
    <span className={theme.label}>Delete all data</span>
  </button>
);