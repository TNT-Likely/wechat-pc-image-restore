const fs = require('fs')
const path = require('path')

/**
 * 读取文件
 * @param {*} url 文件地址
 * @returns 
 */
const readFile = url => {
    const stream = fs.createReadStream(url)

    return new Promise((resolve, reject) => {
        let result = []
        stream.on('data', chunk => {
            result.push(chunk)
        })

        stream.on('end', () => {
            resolve(Buffer.concat(result))
        })

        stream.on('err', () => {
            reject()
        })
    })
}

/**
 * 获取异或加密的key
 * @param {*} content 
 */
const getXORKey = content => {
    const base = 0xFF
    const next = 0xD8
    const gifA = 0x47
    const gifB = 0x49
    const pngA = 0x89
    const pngB = 0x50

    let firstV = content[0],
        nextV = content[1],
        jT = firstV ^ base,
        jB = nextV ^ next,
        gT = firstV ^ gifA,
        gB = nextV ^ gifB,
        pT = firstV ^ pngA,
        pB = nextV ^ pngB;

    let v = firstV ^ base;
    let extName = 'jpg'
    if (jT == jB) {
        v = jT;
        extName = 'jpg'
    } else if (gT == gB) {
        v = gT;
        extName = 'gif'
    } else if (pT == pB) {
        v = pT;
        extName = 'png'
    }

    return {
        key: v,
        extName
    }
}

var checkType = function (o, type) {
    return Object.prototype.toString.call(o) === '[object ' + (type || 'Object') + ']'
}

const getFiles = async (dir, res = []) => {
    if (!checkType(dir, 'String')) {
        return []
    }

    if (path.extname(dir)) {
        return [dir]
    }

    var files = fs.readdirSync(dir)

    files.forEach(async function (i) {
        var filePath = path.join(dir, i)
        var stat = fs.statSync(filePath);

        if (stat.isFile()) {
            res.push(filePath)
        } else if (stat.isDirectory()) {
            res = res.concat(await getFiles(filePath, res))
        }
    })

    return res
}

module.exports = {
    readFile,
    getXORKey,
    getFiles
}