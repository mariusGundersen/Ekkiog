import mix from '@es-git/mix';
import Memory from '@es-git/memory-repo';
import objectMixin, { CommitObject } from '@es-git/object-mixin';
import fetchMixin from '@es-git/fetch-mixin';
import pushMixin from '@es-git/push-mixin';
import commitMixin from '@es-git/commit-mixin';
import checkoutMixin from '@es-git/checkout-mixin';
import walkersMixin from '@es-git/walkers-mixin';
import pathToObjectMixin from '@es-git/path-to-object-mixin';

(Symbol as any).asyncIterator = (Symbol as any).asyncIterator || Symbol("Symbol.asyncIterator");

async function run(){
  const Repo = mix(Memory)
    .with(objectMixin)
    .with(commitMixin)
    .with(walkersMixin)
    .with(checkoutMixin)
    .with(pathToObjectMixin)
    .with(fetchMixin, fetch)
    .with(pushMixin, fetchIt);

  const repo = new Repo();

  const me = {
    name: 'Marius Gundersen',
    email: 'me@mariusgundersen.net',
    date: new Date()
  };

  await repo.fetch('http://localhost:8080/git/github.com/es-git/test-pull.git', {refspec: 'refs/heads/*:refs/remotes/github.com/es-git/test-pull/*'});
  const refs = await repo.listRefs();
  console.log(refs);
  const tree = await repo.checkout('refs/remotes/github.com/es-git/test-pull/master');
  console.log(tree);
  const newTree = {
    files: tree.files,
    folders: {
      'src': {
        files: {
          ...tree.folders['src'].files,
          'git.html': {
            mode: 0o100644,
            text: (document.body.parentNode as HTMLElement).outerHTML
          }
        },
        folders: tree.folders['src'].folders
      }
    }
  }
  await repo.setRef('refs/heads/master', await repo.getRef('refs/remotes/github.com/es-git/test-pull/master') as string);
  const hash = await repo.commit('refs/heads/master', newTree, 'This was commited and pushed in the browser', me);
  console.log(hash);
  const commit = await repo.loadObject(hash) as CommitObject;
  const htmlFile = await repo.loadObjectByPath(commit.body.tree, 'src/git.html');
  console.log(htmlFile);
  await repo.push('http://localhost:8080/git/github.com/es-git/test-pull.git', 'refs/heads/master');
}

run();

function fetchIt(url : string, options : {}){
  return fetch(url, {
    ...options,
    credentials: 'include'
  });
}