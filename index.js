const fs = require('fs')
const path = require('path')
const { readFile, getXORKey, getFiles } = require('./lib/util')
const { PromiseLimit } = require('./lib/promise')

const work = ({
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


const myPromise = new PromiseLimit(5)
const start = async function (dir) {
    const files = await getFiles(dir)

    const all = files.map(url => {
        return () => work({
            url,
            baseDir: 'E:\\wechat\\images'
        })
    })
    myPromise.push(all)
    myPromise.start()
}

const dir = 'C:\\Users\\admin\\Documents\\WeChat Files\\wxid_jiq3aqeuoqyd22\\FileStorage\\Image\\2021-07'
start(dir)