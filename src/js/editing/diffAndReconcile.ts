import { diff } from 'ennea-tree';
import { EnneaTree, MutableContext } from './types';
import reconcile from './reconciliation/reconcile';

export default function diffAndReconcile(before : EnneaTree, after : EnneaTree, context : MutableContext){
  const changes = diff(before, after);
  return reconcile(context, changes);
}