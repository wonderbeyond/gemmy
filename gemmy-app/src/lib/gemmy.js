// I want a build failure if REACT_APP_GEMMY_BASE_URL not defind in env
export const GEMMY_BASE_URL = process.env.REACT_APP_GEMMY_BASE_URL

if (!GEMMY_BASE_URL) {
  throw Error('REACT_APP_GEMMY_BASE_URL is required in env!')
}

export class GemmyClient {
  fetchIndex() {
    return fetch(`${GEMMY_BASE_URL}/gemmy-index.json`).then(resp => {
      let data = resp.json()
      return data
    })
  }
}
