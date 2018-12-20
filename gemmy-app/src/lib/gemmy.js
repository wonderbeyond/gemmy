export const GEMMY_BASE_URL = `https://raw.githubusercontent.com/wonderbeyond/gemmy/gh-pages`

export class GemmyClient {
    constructor() {
    }

    fetchIndex() {
        return fetch(`${GEMMY_BASE_URL}/gemmy-index.json`).then(resp => {
            let data = resp.json()
            return data
        })
    }
}
