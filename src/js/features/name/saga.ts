import { ShowSetNamePopupAction, showPopup, SetNameDoneAction, hidePopup, setItemName, initalSetName, saveForest } from "../../actions/index";
import { put, take, select } from "redux-saga/effects";
import { State } from "../../reduce/index";
import { get } from "ennea-tree";
import { BUTTON, LIGHT } from "ekkiog-editing";

export default function* setName(action : ShowSetNamePopupAction) {
  const {context} : State = yield select();

  const {data} = get(context.forest.enneaTree, action.y, action.x);
  if(data.type !== BUTTON && data.type !== LIGHT) return;

  yield put(initalSetName(data.name));

  yield put(showPopup('SetName'));

  const {name} = yield take<SetNameDoneAction>('SetNameDone');

  yield put(setItemName(action.x, action.y, name));

  yield put(saveForest(`Set name of ${data.type} to ${name}`));

  yield put(hidePopup());
}