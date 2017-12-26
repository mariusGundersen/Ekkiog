export default function getRepoFromUrl(url : string){
  const match = /^https:\/\/(github.com\/[^/]+\/[^/?]+)(\/(tree|blob)\/([A-Z0-9-]+))?/.exec(url);
  if(!match) return false;

  return {
    repo: match[1],
    branch: match[4] || 'WELCOME'
  }
}