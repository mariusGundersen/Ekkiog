import * as github from './github';
import { user } from '../index';

export async function getRepos() : Promise<string[]> {
  if(user === null) throw new Error('no user');
  const repos = await github.getRepos(user.access_token);
  return repos.map(r => r.name);
}

export async function createRepo(name : string) : Promise<string> {
  if(user === null) throw new Error('no user');
  const repo = await github.createRepo(name, user.access_token);
  return repo.name;
}