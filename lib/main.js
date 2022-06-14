const fs = require('fs')
const path = require('path')
const { readFile, getXORKey, getFiles } = require('./util')
const { PromiseLimit } = require('./promise')

/**
 * 还原单个图片
 */
const restoreSingle = ({
    url,
    baseDir
}) => {
    return new Promise(async (resolve, reject) => {
        const content = await readFile(url)
        const { key: v, extName } = getXORKey(content)

        const newContent = content.map(br => {
            return br ^ v
        })

        const newPath = path.join(baseDir, `${path.basename(url).split('.')[0]}.${extName}`)

        fs.writeFile(newPath, newContent, (err) => {
            if (!err) {
                resolve()
            } else {
                reject(err)
            }
        })
    })
}

const restore = async function (options) {
    const files = await getFiles(options.input)
    const myPromise = new PromiseLimit(options.limit || 5)
    const all = files.map(url => {
        return () => restoreSingle({
            url,
            baseDir: options.output
        })
    })
    myPromise.push(all)
    myPromise.start()
}

module.exports = restore