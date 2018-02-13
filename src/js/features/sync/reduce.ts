import {
  Action
} from '../../actions';

export type SyncState = SyncReady | SyncBusy | SyncDone;

export interface SyncReady {
  readonly state : 'ready'
}

export interface SyncBusy {
  readonly state : 'busy'
  readonly progress : string
}

export interface SyncDone {
  readonly state : 'done'
  readonly ok : string[]
  readonly behind : SyncItem[]
  readonly infront : SyncItem[]
  readonly diverged : SyncItem[]
}

export interface SyncItem {
  readonly name : string
  readonly action : 'none' | 'push' | 'pull'
}

const initialState : SyncState = {
  state: 'ready'
};

export default function sync(state = initialState, action : Action) : SyncState {
  switch(action.type){
    case 'start-sync':
      return {
        state: 'busy',
        progress: ''
      };
    case 'sync-progress':
      return {
        state: 'busy',
        progress: action.message
      };
    case 'sync-done':
      return {
        state: 'done',
        ok: action.ok,
        behind: action.behind.map<SyncItem>(name => ({name, action: 'pull'})),
        infront: action.infront.map<SyncItem>(name => ({name, action: 'push'})),
        diverged: action.diverged.map<SyncItem>(name => ({name, action: 'none'}))
      };
    case 'toggle-upload':
      return state.state === 'done' ? {
        ...state,
        infront: state.infront.map(toggle(action.names, 'push')),
        diverged: state.diverged.map(toggle(action.names, 'push'))
      } : state;
    case 'toggle-download':
      return state.state === 'done' ? {
        ...state,
        behind: state.behind.map(toggle(action.names, 'pull')),
        diverged: state.diverged.map(toggle(action.names, 'pull'))
      } : state;
    case 'sync-complete':
      return {
        state: 'ready'
      };
    default:
      return state;
  }
}

function toggle(names : string[], action : 'pull' | 'push') {
  return (item : SyncItem) : SyncItem => names.includes(item.name)
    ? {
      name: item.name,
      action: item.action !== action ? action : 'none'
    } : item;
}