import * as github from './github';

export async function getRepos(accessToken : string) : Promise<string[]> {
  const repos = await github.getRepos(accessToken);
  return repos.map(r => r.name);
}

export async function createRepo(name : string, accessToken : string) : Promise<string> {
  const repo = await github.createRepo(name, accessToken);
  return repo.name;
}