import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import reax from 'reaxjs';

import { fromEvent } from 'rxjs';

import { State } from '../reduce';

import Menu from '../components/Menu';
import WebGLCanvas from '../components/WebGLCanvas';
import NavBar from '../components/NavBar';
import Popup from '../components/Popup';
import GitProgressPopup from '../features/gitPopup';
import Sync from '../features/sync';
import Share from '../features/share';

import style from '../components/main.css';
import {
  startWith,
  map,
  tap
} from 'rxjs/operators';
import { matchPath } from 'react-router';

import { hidePopup, loadForest, startSync, Action, resize } from '../actions';
import getRepoFromUrl from '../utils/getRepoFromUrl';

type Props = State & {dispatch: Dispatch<Action>};

export default connect((s : State) => s)(
  reax({
    sync: () => true,
    hidePopup: () => null
  },
  (events, _, initialProps : Props) => {
    initialProps.dispatch(getFromUrl());

    events.hidePopup.subscribe(() => initialProps.dispatch(hidePopup()));
    events.sync.subscribe(() => initialProps.dispatch(startSync()));
    onResize().subscribe(({pixelWidth, pixelHeight}) => initialProps.dispatch(resize(pixelWidth, pixelHeight)));

    return {}
  },
  ({
    events,
    props,
    values
  }) => {
    return (
      <div className={style.root}>
        <WebGLCanvas
          contextMenu={props.contextMenu}
          currentContext={props.context}
          dispatch={props.dispatch}
          selection={props.selection}
          tickInterval={props.simulation.tickInterval}
          step={props.simulation.step}
          view={props.view}
        />
        {props.context.isReadOnly || (
          <Menu
            contextMenu={props.contextMenu}
            dispatch={props.dispatch}
            forest={props.context.forest}
            editor={props.editor}
            editorMenu={props.editorMenu}
            width={props.view.pixelWidth/window.devicePixelRatio}
            height={props.view.pixelHeight/window.devicePixelRatio}
            view={props.view}
          />
        )}
        <NavBar
          dispatch={props.dispatch}
          currentComponentName={props.context.loading ? `${props.context.loading.name}...` : props.context.name}
          currentComponentRepo={props.context.loading ? props.context.loading.repo : props.context.repo}
          tickInterval={props.simulation.tickInterval}
          gateCount={props.context.loading ? 0 : (props.context.forest.buddyTree.usedSize||2) - 2}
          undoCount={props.context.undoStack && props.context.undoStack.count || 0}
          redoCount={props.context.redoStack && props.context.redoStack.count || 0}
          isLoading={props.context.loading !== undefined}
          isSaving={props.context.saving}
          isReadOnly={props.context.isReadOnly}
          isChildContext={props.context.previous !== undefined}
          user={props.user}
        />
        <GitProgressPopup
          show={props.popup.show === 'GitProgress'}
          state={props.gitPopup}
          hidePopup={events.hidePopup} />
        <Popup
          show={props.popup.show === 'Sync'}
          onCoverClicked={events.hidePopup}>
          <Sync />
        </Popup>
        <Popup
          show={props.popup.show === 'Share'}
          onCoverClicked={events.hidePopup}>
          <Share
            name={props.context.name}
            user={props.user}
            hidePopup={events.hidePopup}
            startSync={events.sync} />
        </Popup>
      </div>
    );
  }
));

function onResize(){
  return fromEvent(window, 'resize').pipe(
    startWith({} as Event),
    map(() => ({
      pixelWidth: window.document.body.clientWidth * window.devicePixelRatio,
      pixelHeight: window.document.body.clientHeight * window.devicePixelRatio
    })));
}

function getFromUrl(){
  const search = new URLSearchParams(document.location.search);
  const match = matchPath<{repo? : string, name : string}>(document.location.pathname, {path:'/c/:name/:repo*'});
  if(match){
    return loadForest(
      match.params.repo || '',
      match.params.name,
    search.get('hash') || undefined);
  }else{
    const match = getRepoFromUrl(document.referrer);
    if(match){
      return loadForest(
        match.repo,
        match.branch);
    }else{
      return loadForest(
        '',
        'WELCOME',
        search.get('hash') || undefined);
    }
  }
}