// I want a build failure if REACT_APP_GEMMY_BASE_URL not defind in env
import snarkdown from 'snarkdown';
export const GEMMY_BASE_URL = process.env.REACT_APP_GEMMY_BASE_URL

if (!GEMMY_BASE_URL) {
  throw Error('REACT_APP_GEMMY_BASE_URL is required in env!')
}

export class GemmyClient {
  fetchIndex() {
    return fetch(`${GEMMY_BASE_URL}/gems/gemmy-index.json`).then(resp => {
      let data = resp.json()
      return data
    })
  }

  getChunkURL(chunkIndex) {
    let s = chunkIndex.toString().padStart(5, '0')
    return `${GEMMY_BASE_URL}/gems/chunks/${s.slice(0, 2)}/${s.slice(2, 4)}/${s.slice(4)}`
  }
}

export function GEM2Html(GEM) {
  return snarkdown(GEM.replace(/^\s*\[[\w\s-]+\]/, ''))
}
