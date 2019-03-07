export const GEMMY_BASE_URL = process.env.REACT_APP_GEMMY_BASE_URL

if (!GEMMY_BASE_URL) {
  throw Error('REACT_APP_GEMMY_BASE_URL is required in env!')
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class GemmyClient {
  async fetchIndex() {
    let resp = await fetch(`${GEMMY_BASE_URL}/gems/gemmy-index.json`)
    this.indexData = await resp.json()
    console.debug('[GEM] Got index data:', this.indexData)
    return this.indexData
  }

  async randomGet() {
    if (!this.indexData) {
      await this.fetchIndex()
    }

    let indexData = this.indexData
    let hitNum = randomInt(1, indexData.total_count) // starts from 1
    let pageNum = Math.ceil(hitNum / indexData.pagination.size)  // start from 1
    let inPageOffset = (hitNum % indexData.pagination.size) - 1 // start from 0
    if (inPageOffset === -1) {
      inPageOffset = indexData.pagination.size - 1
    }
    console.debug(`[GEM] Hit gem#${hitNum}, at page#${pageNum} line#${inPageOffset + 1}`);
    let resp = await fetch(`${this.getChunkURL(pageNum - 1)}`);
    let text = await resp.text()
    let lines = text.split('\n')
    let hitGem = lines[inPageOffset]
    console.debug('GEM:', hitGem);
    return hitGem;
  }

  getChunkURL(chunkIndex) {
    let s = chunkIndex.toString().padStart(5, '0')
    return `${GEMMY_BASE_URL}/gems/chunks/${s.slice(0, 2)}/${s.slice(2, 4)}/${s.slice(4)}`
  }
}
