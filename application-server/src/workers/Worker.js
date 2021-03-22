const {
    Worker
} = require('worker_threads')

// Export worker 
module.exports = function _useWorker(filepath, timer, id) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(filepath)
        worker.on('online', () => {
            console.log('----------------')
            console.log('Filepath: ' + filepath)
            console.log('Timer: ' + timer)
            console.log('Id: ' + id)
            console.log('----------------')
            worker.postMessage(timer + "/" + id);
        })
        worker.on('message', messageFromWorker => {
            worker.postMessage('end');
            return resolve
        })
        worker.on('error', reject)
        worker.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`))
            }
        })
    })
}