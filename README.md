# whirlwind-example

An example repo of how to use [xolvio/whirlwind](https://github.com/xolvio/whirlwind).

To use on AWS Lambda you need to deploy it first:

1. clone this repo

2. run `npm install`

3. run `npm run deploy`

4. Customise `runTest.js` to define your test scenario and load parameters.

And then you can run tests by eg. `npm run soak`

We created four test types: `stress`, `load`, `soak` and `spite`.

# Stress test
Stress test is a test which starts with some predefined `startLoad` load and increases the load during the test to a predefined `endLoad`. Defaults are:
```
startLoad: 1, // number of requests per second at the beginning of the test
endLoad: 3, // number of requests per second at the end of the test
rampUpTime: 5 // time duration
```

# Load test
Load test is similar to stress test, but it has stationary phases, where the load is kept at the same requests per second. It allows to check if the server is able to hold up with a current level of load.
Defaults are:
```
startLoad: 1, // number of requests per second at the beginning of the test
  endLoad: 3, // number of requests per second at the end of the test
  rampUpTimePerStep: 15, // time in which load will be increasing during each step/phase of the test
  flatDurationPerStep: 40, // time in each step/phase with a constant load
  numberOfSteps: 2, // number of step/phases in test, in each step there will be a higher load
  rampUpType: 'linear' // defines if each step has linear, or exponential growth
  ```

# Soak test
Soak test is running on a constant load. It allows to check if the server is stable with a consistent load. It's best to run it for a longer time periods, eg. 8 hours.
Defaults are:
```
load: 1, // number of requests per second during the whole test
duration: 1 // duration of the test in seconds
```

# Spike test
Spike test checks if the server can handle spike loads. It defines some `consistentLoad` and `spikeLoad`, which should be considerably higher. After a few spikes of load you can check if any requests were dropped and how long it takes for the server to get back to low response latency on a consisntent load phase.
