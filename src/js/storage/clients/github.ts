export interface Repo {
  readonly name : string
  readonly full_name : string
}

export async function getRepos(accessToken : string) : Promise<Repo[]> {
  const repos : Repo[] = [];
  for await (const result of fetchAllPages<Repo[]>('https://api.github.com/user/repos?type=owner', options(accessToken))){
    repos.push(...result);
  }
  return repos;
}

export async function createRepo(name : string, accessToken : string) : Promise<Repo> {
  const response = await fetch('https://api.github.com/user/repos?type=owner', {
    ...options(accessToken),
    method: 'POST',
    body: JSON.stringify({
      name,
      description: 'This is a repository made by Ekkiog',
      homepage: 'https://ekkiog.mariusgundersen.net/demo',
      has_issues: false,
      has_projects: false,
      has_wiki: false
    })
  });

  return await response.json();
}

async function* fetchAllPages<T>(url : string, init : RequestInit) : AsyncIterableIterator<T> {
  const response = await fetch(url, init);
  if(!response.ok) throw new Error('Could not load');
  yield await response.json();
  const next = getNext(response.headers);
  if(next){
    yield* fetchAllPages(next, init);
  }
}

function options(accessToken : string) : RequestInit {
  return {
    mode: 'cors',
    headers: {
      Authorization: `token ${accessToken}`
    }
  };
}

function getNext(headers : Headers){
  const link = headers.get("Link");
  if(!link) return null;
  const regex = /<([^>]+)>; rel="(\w+)",/g;
  let myArray;
  while ((myArray = regex.exec(link)) !== null) {
    if(myArray[2] === 'next'){
      return myArray[1];
    }
  }
}