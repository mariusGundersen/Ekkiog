import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import reax from 'reaxjs';

import { fromEvent } from 'rxjs/observable/fromEvent';

import { State } from '../reduce';

import Menu from './Menu';
import WebGLCanvas from './WebGLCanvas';
import NavBar from './NavBar';

import style from './main.css';
import {
  startWith,
  map
} from 'rxjs/operators';
import { Route } from 'react-router';

type Props = State & {dispatch: Dispatch<State>};

export default connect((s : State) => s)(
  reax({
  },
  (_, props, initialProps : Props) => ({
    size: onResize()
  }),
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
        {props.router.isReadOnly || (
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
          currentComponentName={props.context.name}
          currentComponentRepo={props.context.repo}
          tickCount={props.simulation.tickCount}
          tickInterval={props.simulation.tickInterval}
          gateCount={(props.context.forest.buddyTree.usedSize||2) - 2}
          undoCount={props.context.undoStack && props.context.undoStack.count || 0}
          redoCount={props.context.redoStack && props.context.redoStack.count || 0}
          isLoading={props.context.loading !== undefined}
          isSaving={props.context.saving}
        />
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