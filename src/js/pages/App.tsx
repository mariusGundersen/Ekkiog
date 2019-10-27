import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import reax, { constant } from 'reaxjs';

import { fromEvent, merge } from 'rxjs';

import { State } from '../reduce';

import Menu from '../components/Menu';
import WebGLCanvas from '../components/WebGLCanvas';
import NavBar from '../components/NavBar';
import Popup from '../components/Popup';
import GitProgressPopup from '../features/gitPopup';
import Sync from '../features/sync';
import Share from '../features/share';
import MainMenu from '../features/mainMenu';

import style from './App.scss';
import {
  startWith,
  map,
  tap,
  scan
} from 'rxjs/operators';
import { matchPath } from 'react-router';

import { hidePopup, loadForest, startSync, Action, resize, insertComponentPackage, createForest } from '../actions';
import getRepoFromUrl from '../utils/getRepoFromUrl';
import DelayEnterExit from '../components/DelayEnterExit';
import SearchResults from '../features/fileMenu/SearchResults';
import FileMenu from '../features/fileMenu';

type Props = State & DispatchProp<Action>;

export default connect((s: State) => s)(
  reax(
    {
      sync: constant(),
      hidePopup: constant(),
      toggleMainMenu: constant(),
      toggleSearchMenu: constant()
    },
    (events, _, initialProps: Props) => {
      initialProps.dispatch(getFromUrl());

      events.hidePopup.subscribe(() => initialProps.dispatch(hidePopup()));
      events.sync.subscribe(() => initialProps.dispatch(startSync()));
      onResize().subscribe(({ pixelWidth, pixelHeight }) => initialProps.dispatch(resize(pixelWidth, pixelHeight)));

      const showMainMenu = events.toggleMainMenu.pipe(toggle(false));
      const showFileMenu = events.toggleSearchMenu.pipe(toggle(false));
      const showMenu = merge(
        showMainMenu.pipe(map(s => s && 'main')),
        showFileMenu.pipe(map(s => s && 'file'))
      );
      return {
        showMainMenu,
        showFileMenu,
        showMenu
      }
    },
    (values, events, props) => (
      <div className={style.root} data-menu={values.showMenu}>
        <DelayEnterExit
          exitDelay={1000}
          show={values.showMainMenu}
          component={() =>
            <MainMenu
              startSync={events.sync}
              user={props.user} />
          } />
        <DelayEnterExit
          show={values.showFileMenu}
          exitDelay={1000}
          component={() =>
            <FileMenu
              insertPackage={component => props.dispatch(insertComponentPackage(component))}
              openComponent={component => props.dispatch(loadForest(component.repo, component.name))}
              createComponent={name => props.dispatch(createForest(name))}
              isReadOnly={props.context.isReadOnly} />
          } />
        <div className={style.playArea}>
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
              width={props.view.pixelWidth / window.devicePixelRatio}
              height={props.view.pixelHeight / window.devicePixelRatio}
              view={props.view}
            />
          )}
          <NavBar
            dispatch={props.dispatch}
            currentComponentName={props.context.loading ? `${props.context.loading.name}...` : props.context.name}
            currentComponentRepo={props.context.loading ? props.context.loading.repo : props.context.repo}
            tickInterval={props.simulation.tickInterval}
            gateCount={props.context.loading ? 0 : (props.context.forest.buddyTree.usedSize || 2) - 2}
            undoCount={props.context.undoStack && props.context.undoStack.count || 0}
            redoCount={props.context.redoStack && props.context.redoStack.count || 0}
            isLoading={props.context.loading !== undefined}
            isSaving={props.context.saving}
            isReadOnly={props.context.isReadOnly}
            isChildContext={props.context.previous !== undefined}
            user={props.user}
            showMainMenu={values.showMainMenu}
            toggleMainMenu={events.toggleMainMenu}
            showSearchMenu={values.showFileMenu}
            toggleSearchMenu={events.toggleSearchMenu}
          />
        </div>
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
    )
  ));

const toggle = (initial = false) => scan(state => !state, initial);

function onResize() {
  return fromEvent(window, 'resize').pipe(
    startWith({} as Event),
    map(() => ({
      pixelWidth: window.document.body.clientWidth * window.devicePixelRatio,
      pixelHeight: window.document.body.clientHeight * window.devicePixelRatio
    })));
}

function getFromUrl() {
  const search = new URLSearchParams(document.location.search);
  const match = matchPath<{ repo?: string, name: string }>(document.location.pathname, { path: '/c/:name/:repo*' });
  if (match) {
    return loadForest(
      match.params.repo || '',
      match.params.name,
      search.get('hash') || undefined);
  } else {
    const match = getRepoFromUrl(document.referrer);
    if (match) {
      return loadForest(
        match.repo,
        match.branch);
    } else {
      return loadForest(
        '',
        'WELCOME',
        search.get('hash') || undefined);
    }
  }
}
