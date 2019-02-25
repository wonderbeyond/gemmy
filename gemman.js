/**
 * gemman -- GEM Manager
 */
const yaml = require('js-yaml');
const dedent = require('dedent');
const path = require('path')
const fs = require('fs')
const shell = require('shelljs');
const readline = require('readline');

const {
  tagsIndexDir,
  chunksDir,
  loadIndex,
  dumpIndex,
  iterChunks,
  getPositionDetailByID,
  getChunkPath,
  getGEMCount,
  extractGEMTags
} = require('./lib/gemmy')

var program = require('commander');

program.command('check-count').action(function() {
  const indexData = loadIndex()
  const count = getGEMCount()
  console.log(`Total GEM count: ${count}`);
  console.log(`Indexed count:   ${indexData.total_count}`);
})

program.command('index [GEMs]')
  .description(dedent`
    Append GEMS, one GEM per line.

      Example:

        ${process.argv[1]} index '
          [linux shell]查找文件所属包: dpkg -S /usr/bin/nc
          [linux shell]查看最近10秒有哪些文件变动: find . -cmin -0.1 -type f'

        Or

        ${process.argv[1]} index < ~/gemmy-dump.txt
  `).action(function(GEMs) {
    let indexData = yaml.safeLoad(
      fs.readFileSync('./gems/index-initial.yaml', 'utf8')
    );
    let perPage = indexData.pagination.size
    let totalCount = 0
    let lastID = totalCount  // start from 1

    let tagsIndex = new class TagsIndex extends Map {
      add(tagName, id) {
        let ids = this.get(tagName) || new Set()
        ids.add(id)
        this.set(tagName, ids)
      }

      toObj() {
        let obj = {}
        for (let [k, v] of this) {
          obj[k] = [...v]
        }
        return obj
      }
    }

    console.log(dedent`
      Current state:
        Total count: ${totalCount}
        Chunk size: ${perPage}
    `);

    function appendOne(one) {
      one = one.trim()
      if (!one) {
        return
      }

      let newID = ++lastID
      let tags = extractGEMTags(one)
      let {pageNum, inPageOffset} = getPositionDetailByID(newID, perPage)
      let chunkPath = getChunkPath(pageNum - 1)
      let dirName = path.dirname(chunkPath)

      console.info(`* Appending ${one}`);
      console.info('\tID:', newID);
      console.info('\tTags:', tags);
      console.log(`\tLocation: page#${pageNum}, line#${inPageOffset + 1}`)
      console.log(`\tChunkPath: ${chunkPath}`)

      for (let tagName of tags) {
        tagsIndex.add(tagName, newID)
      }

      // make chunk dir
      fs.mkdirSync(dirName, {recursive: true})
      fs.appendFileSync(chunkPath, `${one}\n`)
      totalCount++
    }

    function updateIndex() {
      indexData.total_count = totalCount
      indexData.tags = (indexData.tags || []).concat(
        [...tagsIndex.keys()]
      )
      indexData.tags = [...new Set(indexData.tags)]  // get unique list

      dumpIndex(indexData)

      // write tags index
      fs.mkdirSync(tagsIndexDir, {recursive: true})
      for (let [tagName, ids] of tagsIndex) {
        let tagIndexFilePath = path.join(tagsIndexDir, `${tagName}.json`)

        try {
          let eIDs = JSON.parse(fs.readFileSync(tagIndexFilePath, 'utf8'))
          ids = new Set([...ids, ...eIDs])
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw err
          }
        }

        fs.writeFileSync(
          tagIndexFilePath,
          JSON.stringify([...ids])
        )
      }

      console.log(dedent`---
        Updated main index: ${JSON.stringify(indexData)}
        Tags index: ${JSON.stringify(tagsIndex.toObj())}
      `);
    }

    if (GEMs) {
      // from command line
      for (let one of GEMs.split('\n')) {
        appendOne(one)
      }
      updateIndex()
    } else {
      // from stdin
      const rl = readline.createInterface({
        input: process.stdin
      })
      rl.on('line', appendOne)
      rl.on('close', () => {
        updateIndex()
      })
    }
  })

program.parse(process.argv)
