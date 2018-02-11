import {
  Action
} from '../../actions';

export interface SyncState {
  readonly loading : boolean
  readonly progress : string
  readonly components : ComponentStatus[]
}

export interface ComponentStatus {
  readonly name : string
  readonly status : 'loading' | 'ok' | 'pull' | 'push' | 'pull-push'
}

const initialState : SyncState = {
  loading: false,
  progress: '',
  components: []
};

export default function sync(state = initialState, action : Action) : SyncState {
  switch(action.type){
    case 'start-sync':
      return {
        loading: true,
        progress: '',
        components: []
      };
    case 'sync-progress':
      return {
        ...state,
        progress: action.message
      };
    case 'sync-list':
      return {
        loading: false,
        progress: '',
        components: action.names.map(name => ({
          name,
          status: 'loading' as 'loading'
        }))
      };
    case 'sync-status':
      console.log('sync-status', action.name, action.status);
      return {
        ...state,
        components: state.components.map(c => c.name === action.name ? action : c)
      };
    default:
      return state;
  }
}