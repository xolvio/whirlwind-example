const Whirlwind = require('whirlwind')

const exampleWorkingScenario = {
  flow: [
    {
      get: {
        url: 'https://google.pl',
        beforeRequest: process.env.INFLUX_HOST ? 'logRequestSentToInflux' : undefined
      },
    }
  ],
}

const exampleComplexScenario = {
  flow: [
    {
      function: 'generateNewUserEmailInFunction' // here we use faker to generate a random new user data, check scenarioProcessor.js
    },
    {
      post: {
        url: '/graphql', // or full URL with https://
        body: JSON.stringify( // string with JSON query/mutation goes here
          {
            email: '{{ newUserEmail }}', // here we use variables created by faker in a function above
            firstName: '{{ firstName }}',
            lastName: '{{ lastName }}'
          }
        ),
        headers: { 'content-type': 'application/json' }, // we define that the body of POST is a JSON, for example for graphql
        capture: { // it's possible to capture data from response and store it for later usage in scenario
          json: '$.data.newCustomer.newAccountId', // use JSONpath here
          as: 'newAccountId' // set the variable name here
        },
        beforeRequest: ['logRequestToConsole', 'logRequestSentToInflux', 'logErrorsInStep'], // check scenarioProcessor.js for details
        afterResponse: 'logResponseToConsole' // check scenarioProcessor.js for details
      },
    }
  ],
  afterScenario: 'writeDataToDB'
}

const scenarios = [
  exampleWorkingScenario,
  // exampleComplexScenario
]

const loadTestParams = { testType: 'load', startLoad: 1, endLoad: 3, rampUpTime: 5 }
const stressTestParams = {
  testType: 'stress',
  startLoad: 1,
  endLoad: 3,
  rampUpTimePerStep: 15,
  flatDurationPerStep: 40,
  numberOfSteps: 2,
  rampUpType: 'linear'
}
const soakTestParams = { testType: 'soak', load: 1, duration: 10 }
const spikeTestParams = {
  testType: 'spike',
  consistentLoad: 1,
  spikeLoad: 5,
  loadTestDuration: 1 * 60,
  spikeDuration: 15,
  numberOfSpikes: 1
}
let runFromLocalArtillery = false
let processorFilename = false // you can define additional processor file with custom hooks
if (process.env.INFLUX_HOST) {
  processorFilename = 'scenarioProcessor.js' // each time you change something inside processor you need to redeploy Lambda
}

const whirlwind = new Whirlwind()

const testToRun = process.argv[2]

switch (testToRun) {
  case 'loadTest':
    whirlwind.generatePhases(loadTestParams)
    break

  case 'stressTest':
    whirlwind.generatePhases(stressTestParams)
    break

  case 'soakTest':
    whirlwind.generatePhases(soakTestParams)
    break

  case 'spikeTest':
    whirlwind.generatePhases(spikeTestParams)
    break

  case 'loadTestLocal':
    whirlwind.generatePhases(loadTestParams)
    runFromLocalArtillery = true
    break

  case 'stressTestLocal':
    whirlwind.generatePhases(stressTestParams)
    runFromLocalArtillery = true
    break

  case 'soakTestLocal':
    whirlwind.generatePhases(soakTestParams)
    runFromLocalArtillery = true
    break

  case 'spikeTestLocal':
    whirlwind.generatePhases(spikeTestParams)
    runFromLocalArtillery = true
    break

  default:
    throw 'You can start one of: loadTest, stressTest, soakTest, spikeTest, loadTestLocal, stressTestLocal, soakTestLocal, spikeTestLocal'
}

whirlwind.runTest(scenarios, processorFilename, runFromLocalArtillery)
