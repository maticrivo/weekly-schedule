import fetch from 'isomorphic-unfetch'

export function fetcher(resource, init) {
  return fetch(resource, init).then((res) => res.json())
}
