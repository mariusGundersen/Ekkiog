import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import reax from 'reaxjs';

import { fromEvent } from 'rxjs/observable/fromEvent';

import { State } from '../reduce';

import Menu from '../components/Menu';
import WebGLCanvas from '../components/WebGLCanvas';
import NavBar from '../components/NavBar';
import Popup from '../components/Popup';
import SelectRepo from '../components/popups/SelectRepo';
import Profile from '../components/popups/Profile';
import GitProgressPopup from '../features/gitPopup';

import style from '../components/main.css';
import {
  startWith,
  map
} from 'rxjs/operators';
import { Route, matchPath } from 'react-router';

import { user } from '../storage';
import { hidePopup, loadForest } from '../actions';
import getRepoFromUrl from '../utils/getRepoFromUrl';
import { PopupState } from '../reduce/popup';

type Props = State & {dispatch: Dispatch<State>};

export default connect((s : State) => s)(
  reax({
    hidePopup: (e : any) => null
  },
  (events, props, initialProps : Props) => {
    initialProps.dispatch(getFromUrl());

    events.hidePopup.subscribe(e => initialProps.dispatch(hidePopup()));

    return {
      size: onResize()
    }
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
          previousContext={props.context.previous}
          selection={props.selection}
          tickInterval={props.simulation.tickInterval}
          width={values.size.pixelWidth}
          height={values.size.pixelHeight}
        />
        {props.context.isReadOnly || (
          <Menu
            contextMenu={props.contextMenu}
            dispatch={props.dispatch}
            editor={props.editor}
            editorMenu={props.editorMenu}
            width={values.size.svgWidth}
            height={values.size.svgHeight}
            view={props.view}
          />
        )}
        <NavBar
          dispatch={props.dispatch}
          currentComponentName={props.context.loading ? `${props.context.loading.name}...` : props.context.name}
          currentComponentRepo={props.context.loading ? props.context.loading.repo : props.context.repo}
          tickCount={props.simulation.tickCount}
          tickInterval={props.simulation.tickInterval}
          gateCount={(props.context.forest.buddyTree.usedSize||2) - 2}
          undoCount={props.context.undoStack && props.context.undoStack.count || 0}
          redoCount={props.context.redoStack && props.context.redoStack.count || 0}
          isLoading={props.context.loading !== undefined}
          isSaving={props.context.saving}
          isReadOnly={props.context.isReadOnly}
        />
        <Popup
          show={props.popup.show === 'Profile'}
          onCoverClicked={events.hidePopup}>
            <Profile user={user as OauthData} />
        </Popup>
        <GitProgressPopup
          show={props.popup.show}
          state={props.gitPopup}
          hidePopup={events.hidePopup} />
      </div>
    );
  }
));

function onResize(){
  return fromEvent(window, 'resize').pipe(
    startWith({}),
    map(e => ({
      svgWidth: window.document.body.clientWidth,
      svgHeight: window.document.body.clientHeight,
      pixelWidth: window.document.body.clientWidth*window.devicePixelRatio,
      pixelHeight: window.document.body.clientHeight*window.devicePixelRatio
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