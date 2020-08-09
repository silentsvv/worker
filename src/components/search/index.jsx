import React, {PureComponent} from 'react'
import _ from 'lodash';
import process from 'process';
import filter from '../../util/filter'
import makeSize from '../../util/size'
import WorkerList from '../../util/workerList'

const benchmark = require('benchmark');
const Benchmark = benchmark.runInContext({ _, process });
window.Benchmark = Benchmark;


export default class SearchInput extends PureComponent {
    constructor() {
        super()

        this.startBenchmark(1000, 1024)

        // this.startBenchmark(10000, 1024 * 10) // 10kb

        // this.startBenchmark(10000, 1024 * 100) // 100kb

        // this.startBenchmark(100000, 1024) // 执行100000次
    }

    startBenchmark(n, size) {
        const suite = new Benchmark.Suite;
        const byteData = makeSize(size)

        suite
        .add(`主线程执行${n}次，返回值${size}byte`, () => {
            filter(n, byteData)
        })
        .add(`1个worker执行${n}次, ，返回值${size}byte`, {
            defer: true,
            fn: async (deferred) => {
                let worker = new WorkerList(1)
                await worker.start(n, byteData)
                deferred.resolve();
                worker.destroy()
            }
        })
        .add(`5个worker执行${n}次, ，返回值${size}byte`, {
            defer: true,
            fn:  async (deferred) => {
                let realN = Math.floor(n / 5)
                let realSize = Math.floor(byteData / 5)
                let worker = new WorkerList(5) 
                await Promise.all(new Array(5).fill().map(() => {
                    return worker.start(realN, realSize)
                }))
                deferred.resolve()
                worker.destroy()
            }
        })
        .add(`10个worker执行${n}次, ，返回值${size}byte`, {
            defer: true,
            fn:  async (deferred) => {
                let realN = Math.floor(n / 10)
                let realSize = Math.floor(byteData / 10)
                let worker = new WorkerList(10) 
                await Promise.all(new Array(10).fill().map(() => {
                    return worker.start(realN, realSize)
                }))
                deferred.resolve()
                worker.destroy()
            }
        })
        .on('complete', function() {
            console.log('最快的是' + this.filter('fastest').map('name'));
        })
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
          // run async
        .run({ 'async': true })
    }

    render() {
        return <p>search</p>
    }
}
