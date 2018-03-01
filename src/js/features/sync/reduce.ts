import {
  Action
} from '../../actions';

export interface SyncState {
  readonly isUpToDate : boolean
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
  isUpToDate: true,
  ok: [],
  behind: [],
  infront: [],
  diverged: []
};

export default function sync(state = initialState, action : Action) : SyncState {
  switch(action.type){
    case 'sync-done':
      return {
        isUpToDate: action.behind.length === 0 && action.infront.length === 0 && action.diverged.length === 0,
        ok: action.ok,
        behind: action.behind.map<SyncItem>(name => ({name, action: 'pull'})),
        infront: action.infront.map<SyncItem>(name => ({name, action: 'push'})),
        diverged: action.diverged.map<SyncItem>(name => ({name, action: 'none'}))
      };
    case 'toggle-upload':
      return {
        ...state,
        infront: state.infront.map(toggle(action.names, 'push')),
        diverged: state.diverged.map(toggle(action.names, 'push'))
      };
    case 'toggle-download':
      return {
        ...state,
        behind: state.behind.map(toggle(action.names, 'pull')),
        diverged: state.diverged.map(toggle(action.names, 'pull'))
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