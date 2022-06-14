class PromiseLimit {
    limit = 0
    array = []
    count = 0
    constructor(limit) {
        this.limit = limit
    }

    push(array) {
        this.array = array
    }

    start() {
        this._runTask()
    }

    _runTask() {
        while (this.count < this.limit && !!this.array.length) {
            const promiseFunc = this.array.shift()
            this.count++
            promiseFunc().then((val) => {
                this.count--
                this._runTask()
            })
        }
    }
}

module.exports = {
    PromiseLimit
}