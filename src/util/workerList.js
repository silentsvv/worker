import Worker from '../worker/search.worker.js'

export default class WorkerList {
    constructor(number = 1) {
      const workers = (new Array(number)).fill('').map(() => new Worker());
      this.id = 0;
      this.callBackMap = {};
      workers.forEach(worker => {
        worker.addEventListener('message', event => {
          const { id } = event.data;
          this.callBackMap[id]();
        });
      });
      this.workers = workers;
    }
  
    start(n, size) {
      return new Promise(resolve => {
        const id = this.id++;
        this.callBackMap[id] = resolve;
        const index = id % this.workers.length;
        const worker = this.workers[index];
        worker.postMessage({id, n, size});
      });
    }
  
    destroy() {
      this.workers.forEach(worker => worker.terminate());
    }
  }