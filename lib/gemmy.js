const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path')

const indexFile = './dist/gems/gemmy-index.yaml'
const chunksDir = './dist/gems/chunks'
const tagsIndexDir = './dist/gems/tags-index'

function loadIndex() {
  return yaml.safeLoad(fs.readFileSync(indexFile, 'utf8'));
}

function dumpIndex(data) {
  fs.writeFileSync(indexFile, yaml.safeDump(data))
}

function* iterChunks() {
  let hasMore = true
  for (let i = 0; hasMore; i++) {
    try {
      let chunkPath = getChunkPath(i)
      let chunk = fs.readFileSync(chunkPath, 'utf8')
      yield chunk.trim()
    } catch (err) {
      if (err.code == 'ENOENT') {
        hasMore = false
      } else {
        throw err
      }
    }
  }
}

function getChunkPath(chunkIndex) {
  let s = chunkIndex.toString().padStart(5, '0')
  return path.join(chunksDir, `${s.slice(0, 2)}/${s.slice(2, 4)}/${s.slice(4)}`)
}

function getPositionDetailByID(ID, perPage=null) {
  if (!perPage) {
    perPage = loadIndex().pagination.size
  }
  let pageNum = Math.ceil(ID / perPage)  // start from 1
  let inPageOffset = (ID % perPage) - 1 // start from 0
  if (inPageOffset == -1) {
    inPageOffset = perPage - 1
  }
  // console.debug(`GEM#${ID} is at page#${pageNum} line#${inPageOffset + 1}`)
  return {pageNum, inPageOffset}
}

function getGEMCount() {
  let count = 0
  for (let chunk of iterChunks()) {
    count += chunk.split('\n').length
  }
  return count
}

function extractGEMTags(gem) {
  let m = /^\s*\[([\w\s-]+)\]/.exec(gem)
  if (m) {
    return m[1].split(/[,\s]+/).filter(e => e)
  }
  return []
}

module.exports = {
  chunksDir,
  tagsIndexDir,
  loadIndex,
  dumpIndex,
  iterChunks,
  getPositionDetailByID,
  getChunkPath,
  getGEMCount,
  extractGEMTags
}
