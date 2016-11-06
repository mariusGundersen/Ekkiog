export default function mutateContext(context, oldTree, newTree){
    const changes = ennea.diff(oldTree, newTree);
    reconcile(context, changes);
}