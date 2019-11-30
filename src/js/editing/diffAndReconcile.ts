import { diff } from 'ennea-tree';
import { EnneaTree, MutableContext } from './types';
import reconcile from './reconciliation/reconcile';

export default function diffAndReconcile(context: MutableContext, before?: EnneaTree, after?: EnneaTree) {
  if (before === after) return;
  reconcile(context, diff(before, after));
}