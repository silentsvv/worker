import filter from '../util/filter.js';

self.onmessage = (e) => {
    const {id, n, size} = e.data;
    const result = filter(n, size)
    self.postMessage({id, result});
}